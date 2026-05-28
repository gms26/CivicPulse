package com.civicpulse.controller;

import com.civicpulse.dto.response.AnalyticsResponse;
import com.civicpulse.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {
        "https://civicpulse-frontend-3mb8.onrender.com",
        "http://localhost:5173"
})
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get summary metrics.
     */
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsResponse> getSummary() {
        AnalyticsResponse response = analyticsService.getSummary();
        return ResponseEntity.ok(response);
    }

    /**
     * Get issue counts by category.
     */
    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Long>> getByCategory() {
        Map<String, Long> categoryCounts = analyticsService.getIssuesByCategory();
        return ResponseEntity.ok(categoryCounts);
    }

    /**
     * Get issue counts by status.
     */
    @GetMapping("/by-status")
    public ResponseEntity<Map<String, Long>> getByStatus() {
        Map<String, Long> statusCounts = analyticsService.getIssuesByStatus();
        return ResponseEntity.ok(statusCounts);
    }

    /**
     * Get issue reporting trends over the last 30 days.
     */
    @GetMapping("/trends")
    public ResponseEntity<Map<String, Long>> getTrends() {
        Map<String, Long> trends = analyticsService.getIssueTrends();
        return ResponseEntity.ok(trends);
    }
}
