package com.civicpulse.service;

import com.civicpulse.dto.request.IssueCreateRequest;
import com.civicpulse.dto.response.IssueResponse;
import com.civicpulse.entity.Issue;
import com.civicpulse.entity.User;
import com.civicpulse.entity.enums.IssueCategory;
import com.civicpulse.entity.enums.IssueStatus;
import com.civicpulse.entity.enums.Priority;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.exception.UnauthorizedException;
import com.civicpulse.repository.IssueRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class IssueService {

    private static final Logger log = LoggerFactory.getLogger(IssueService.class);
    private final IssueRepository issueRepository;
    private final CloudinaryService cloudinaryService;

    public IssueService(IssueRepository issueRepository, CloudinaryService cloudinaryService) {
        this.issueRepository = issueRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional
    public IssueResponse createIssue(IssueCreateRequest request, MultipartFile image, User reporter) throws IOException {
        try {
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                try {
                    imageUrl = cloudinaryService.uploadImage(image);
                } catch (Exception e) {
                    log.warn("Image upload failed, saving without image: {}", e.getMessage());
                    imageUrl = null;
                }
            }

            Issue issue = new Issue();
            issue.setTitle(request.getTitle());
            issue.setDescription(request.getDescription());
            issue.setCategory(IssueCategory.valueOf(request.getCategory().toUpperCase()));
            issue.setLocationAddress(request.getLocationAddress());
            issue.setLatitude(request.getLatitude());
            issue.setLongitude(request.getLongitude());
            issue.setImageUrl(imageUrl);
            issue.setReporter(reporter);
            
            // Defaults for a new issue
            issue.setStatus(IssueStatus.OPEN);
            issue.setPriority(Priority.LOW);

            Issue savedIssue = issueRepository.save(issue);
            return mapToResponse(savedIssue);
        } catch (Exception e) {
            log.error("Issue creation failed: {}", e.getMessage(), e);
            throw e;
        }
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

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));
        return mapToResponse(issue);
    }

    @Transactional(readOnly = true)
    public Page<IssueResponse> getMyIssues(User reporter, Pageable pageable) {
        Page<Issue> issues = issueRepository.findByReporterId(reporter.getId(), pageable);
        return issues.map(this::mapToResponse);
    }

    @Transactional
    public void deleteOwnIssue(Long id, User reporter) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        if (!issue.getReporter().getId().equals(reporter.getId())) {
            throw new UnauthorizedException("You can only delete your own issues");
        }

        issueRepository.delete(issue);
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
