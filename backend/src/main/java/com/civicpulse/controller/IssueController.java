package com.civicpulse.controller;

import com.civicpulse.dto.request.IssueCreateRequest;
import com.civicpulse.dto.response.IssueResponse;
import com.civicpulse.entity.User;
import com.civicpulse.service.IssueService;
import com.civicpulse.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;
    private final CloudinaryService cloudinaryService;

    public IssueController(IssueService issueService, CloudinaryService cloudinaryService) {
        this.issueService = issueService;
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * Create a new issue.
     * Accessible by CITIZEN.
     * Uses multipart/form-data to allow image upload alongside JSON data.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<IssueResponse> createIssue(
            @RequestPart("data") @Valid IssueCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User reporter) throws IOException {

        IssueResponse response = issueService.createIssue(request, image, reporter);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all issues with optional filtering and pagination.
     * Accessible by ANY (Citizen & Admin).
     */
    @GetMapping
    public ResponseEntity<Page<IssueResponse>> getAllIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        Page<IssueResponse> issues = issueService.getAllIssues(category, status, keyword, pageable);
        return ResponseEntity.ok(issues);
    }

    /**
     * Get an issue by its ID.
     * Accessible by ANY.
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Long id) {
        IssueResponse response = issueService.getIssueById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all issues reported by the currently authenticated user.
     * Accessible by CITIZEN.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Page<IssueResponse>> getMyIssues(
            @AuthenticationPrincipal User reporter,
            Pageable pageable) {

        Page<IssueResponse> issues = issueService.getMyIssues(reporter, pageable);
        return ResponseEntity.ok(issues);
    }

    /**
     * Delete an issue. Users can only delete their own issues.
     * Accessible by CITIZEN.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Void> deleteOwnIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal User reporter) {

        issueService.deleteOwnIssue(id, reporter);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/test-cloudinary")
    public ResponseEntity<String> testCloudinary() {
        try {
            String result = cloudinaryService.testConnection();
            return ResponseEntity.ok("Cloudinary OK: " + result);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Cloudinary FAILED: " + e.getMessage());
        }
    }
}
