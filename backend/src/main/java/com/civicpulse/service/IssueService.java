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
            log.info("=== ISSUE CREATION START ===");
            log.info("Reporter: id={}, email={}", reporter != null ? reporter.getId() : "NULL", reporter != null ? reporter.getEmail() : "NULL");
            log.info("Request: title={}, category={}, locationAddress={}, lat={}, lon={}",
                request.getTitle(), request.getCategory(), request.getLocationAddress(),
                request.getLatitude(), request.getLongitude());
            log.info("Image present: {}", image != null && !image.isEmpty());

            // Step 1: Image upload
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                try {
                    log.info("Step 1: Uploading image, size={} bytes", image.getSize());
                    imageUrl = cloudinaryService.uploadImage(image);
                    log.info("Step 1: Image uploaded OK: {}", imageUrl);
                } catch (Exception e) {
                    log.warn("Step 1: Image upload failed, saving without image: {}", e.getMessage());
                    imageUrl = null;
                }
            } else {
                log.info("Step 1: No image to upload, skipping");
            }

            // Step 2: Build Issue entity
            log.info("Step 2: Building Issue entity...");
            Issue issue = new Issue();
            issue.setTitle(request.getTitle());
            issue.setDescription(request.getDescription());
            
            log.info("Step 2a: Parsing category: '{}'", request.getCategory());
            issue.setCategory(IssueCategory.valueOf(request.getCategory().toUpperCase()));
            
            issue.setLocationAddress(request.getLocationAddress());
            issue.setLatitude(request.getLatitude());
            issue.setLongitude(request.getLongitude());
            issue.setImageUrl(imageUrl);
            issue.setReporter(reporter);
            issue.setStatus(IssueStatus.OPEN);
            issue.setPriority(Priority.LOW);
            log.info("Step 2: Issue entity built OK");

            // Step 3: Save to DB
            log.info("Step 3: Saving issue to database...");
            Issue savedIssue = issueRepository.save(issue);
            log.info("Step 3: Issue saved with id={}", savedIssue.getId());

            // Step 4: Map to response
            log.info("Step 4: Mapping to response...");
            IssueResponse response = mapToResponse(savedIssue);
            log.info("=== ISSUE CREATION SUCCESS, id={} ===", savedIssue.getId());
            return response;

        } catch (Exception e) {
            log.error("=== ISSUE CREATION FAILED ===");
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Full stack trace:", e);
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
