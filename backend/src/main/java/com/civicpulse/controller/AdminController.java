package com.civicpulse.controller;

import com.civicpulse.dto.request.IssueUpdateRequest;
import com.civicpulse.dto.response.IssueResponse;
import com.civicpulse.entity.User;
import com.civicpulse.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/issues")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Get ALL issues with filters and pagination.
     */
    @GetMapping
    public ResponseEntity<Page<IssueResponse>> getAllIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        Page<IssueResponse> issues = adminService.getAllIssues(category, status, keyword, pageable);
        return ResponseEntity.ok(issues);
    }

    /**
     * Update the status of an issue.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateIssueStatus(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request,
            @AuthenticationPrincipal User admin) {

        IssueResponse response = adminService.updateIssueStatus(id, request, admin);
        return ResponseEntity.ok(response);
    }

    /**
     * Update the priority of an issue.
     */
    @PutMapping("/{id}/priority")
    public ResponseEntity<IssueResponse> updateIssuePriority(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request,
            @AuthenticationPrincipal User admin) {

        IssueResponse response = adminService.updateIssuePriority(id, request, admin);
        return ResponseEntity.ok(response);
    }

    /**
     * Assign an issue to an admin.
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<IssueResponse> assignIssue(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request,
            @AuthenticationPrincipal User admin) {

        IssueResponse response = adminService.assignIssue(id, request, admin);
        return ResponseEntity.ok(response);
    }
}
