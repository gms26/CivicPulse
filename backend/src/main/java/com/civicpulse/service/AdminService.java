package com.civicpulse.service;

import com.civicpulse.dto.request.IssueUpdateRequest;
import com.civicpulse.dto.response.IssueResponse;
import com.civicpulse.entity.Issue;
import com.civicpulse.entity.IssueUpdate;
import com.civicpulse.entity.User;
import com.civicpulse.entity.enums.IssueCategory;
import com.civicpulse.entity.enums.IssueStatus;
import com.civicpulse.entity.enums.Priority;
import com.civicpulse.entity.enums.Role;
import com.civicpulse.exception.BadRequestException;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.repository.IssueRepository;
import com.civicpulse.repository.IssueUpdateRepository;
import com.civicpulse.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AdminService {

    private final IssueRepository issueRepository;
    private final IssueUpdateRepository issueUpdateRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AdminService(IssueRepository issueRepository, IssueUpdateRepository issueUpdateRepository, UserRepository userRepository, NotificationService notificationService) {
        this.issueRepository = issueRepository;
        this.issueUpdateRepository = issueUpdateRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public IssueResponse updateIssueStatus(Long id, IssueUpdateRequest request, User admin) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        IssueStatus newStatus;
        try {
            newStatus = IssueStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + request.getStatus());
        }

        if (issue.getStatus() == newStatus) {
            throw new BadRequestException("Issue is already in " + newStatus + " status");
        }

        IssueStatus oldStatus = issue.getStatus();
        issue.setStatus(newStatus);
        
        if (newStatus == IssueStatus.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
        } else if (oldStatus == IssueStatus.RESOLVED) {
            // Reopened
            issue.setResolvedAt(null);
        }

        Issue updatedIssue = issueRepository.save(issue);

        // Audit Trail
        IssueUpdate updateRecord = new IssueUpdate();
        updateRecord.setIssue(updatedIssue);
        updateRecord.setUpdatedBy(admin);
        updateRecord.setOldStatus(oldStatus);
        updateRecord.setNewStatus(newStatus);
        updateRecord.setComment(request.getComment());
        issueUpdateRepository.save(updateRecord);

        // WebSocket Notification
        notificationService.sendStatusUpdate(
                updatedIssue, 
                updatedIssue.getReporter(), 
                oldStatus.getDisplayName(), 
                newStatus.getDisplayName(), 
                request.getComment()
        );

        return mapToResponse(updatedIssue);
    }

    @Transactional
    public IssueResponse updateIssuePriority(Long id, IssueUpdateRequest request, User admin) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        Priority newPriority;
        try {
            newPriority = Priority.valueOf(request.getPriority().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid priority: " + request.getPriority());
        }

        issue.setPriority(newPriority);
        Issue updatedIssue = issueRepository.save(issue);

        return mapToResponse(updatedIssue);
    }

    @Transactional
    public IssueResponse assignIssue(Long id, IssueUpdateRequest request, User admin) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        Long assigneeId = request.getAssignedAdminId();
        if (assigneeId == null) {
            throw new BadRequestException("Assigned admin ID must not be null");
        }

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + assigneeId));

        if (assignee.getRole() != Role.ADMIN) {
            throw new BadRequestException("User to assign is not an admin");
        }

        issue.setAssignedAdmin(assignee);
        Issue updatedIssue = issueRepository.save(issue);

        return mapToResponse(updatedIssue);
    }

    @Transactional(readOnly = true)
    public Page<IssueResponse> getAllIssues(String categoryStr, String statusStr, String keyword, Pageable pageable) {
        IssueCategory category = null;
        if (categoryStr != null && !categoryStr.isEmpty()) {
            try {
                category = IssueCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        IssueStatus status = null;
        if (statusStr != null && !statusStr.isEmpty()) {
            try {
                status = IssueStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Page<Issue> issues = issueRepository.searchIssues(category, status, keyword, pageable);
        return issues.map(this::mapToResponse);
    }

    private IssueResponse mapToResponse(Issue issue) {
        IssueResponse response = new IssueResponse();
        response.setId(issue.getId());
        response.setTitle(issue.getTitle());
        response.setDescription(issue.getDescription());
        response.setCategory(issue.getCategory().name());
        response.setCategoryDisplayName(issue.getCategory().getDisplayName());
        response.setStatus(issue.getStatus().name());
        response.setStatusDisplayName(issue.getStatus().getDisplayName());
        response.setPriority(issue.getPriority() != null ? issue.getPriority().name() : null);
        response.setLocationAddress(issue.getLocationAddress());
        response.setLatitude(issue.getLatitude());
        response.setLongitude(issue.getLongitude());
        response.setImageUrl(issue.getImageUrl());
        response.setCreatedAt(issue.getCreatedAt());
        response.setUpdatedAt(issue.getUpdatedAt());
        response.setResolvedAt(issue.getResolvedAt());

        if (issue.getReporter() != null) {
            response.setReporterId(issue.getReporter().getId());
            response.setReporterName(issue.getReporter().getFullName());
            response.setReporterEmail(issue.getReporter().getEmail());
        }

        if (issue.getAssignedAdmin() != null) {
            response.setAssignedAdminId(issue.getAssignedAdmin().getId());
            response.setAssignedAdminName(issue.getAssignedAdmin().getFullName());
        }

        return response;
    }
}
