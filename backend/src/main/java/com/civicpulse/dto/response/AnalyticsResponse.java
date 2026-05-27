package com.civicpulse.dto.response;


import java.util.Map;

public class AnalyticsResponse {

    private long totalIssues;
    private long openIssues;
    private long inProgressIssues;
    private long resolvedIssues;
    private double resolutionRate;  // Percentage (0-100)

    private Map<String, Long> issuesByCategory;
    private Map<String, Long> issuesByStatus;

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public AnalyticsResponse() {}

    public AnalyticsResponse(long totalIssues, long openIssues, long inProgressIssues, long resolvedIssues, double resolutionRate, Map<String, Long> issuesByCategory, Map<String, Long> issuesByStatus) {
        this.totalIssues = totalIssues;
        this.openIssues = openIssues;
        this.inProgressIssues = inProgressIssues;
        this.resolvedIssues = resolvedIssues;
        this.resolutionRate = resolutionRate;
        this.issuesByCategory = issuesByCategory;
        this.issuesByStatus = issuesByStatus;
    }

    public long getTotalIssues() {
        return totalIssues;
    }

    public void setTotalIssues(long totalIssues) {
        this.totalIssues = totalIssues;
    }

    public long getOpenIssues() {
        return openIssues;
    }

    public void setOpenIssues(long openIssues) {
        this.openIssues = openIssues;
    }

    public long getInProgressIssues() {
        return inProgressIssues;
    }

    public void setInProgressIssues(long inProgressIssues) {
        this.inProgressIssues = inProgressIssues;
    }

    public long getResolvedIssues() {
        return resolvedIssues;
    }

    public void setResolvedIssues(long resolvedIssues) {
        this.resolvedIssues = resolvedIssues;
    }

    public double getResolutionRate() {
        return resolutionRate;
    }

    public void setResolutionRate(double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }

    public Map<String, Long> getIssuesByCategory() {
        return issuesByCategory;
    }

    public void setIssuesByCategory(Map<String, Long> issuesByCategory) {
        this.issuesByCategory = issuesByCategory;
    }

    public Map<String, Long> getIssuesByStatus() {
        return issuesByStatus;
    }

    public void setIssuesByStatus(Map<String, Long> issuesByStatus) {
        this.issuesByStatus = issuesByStatus;
    }

    public static AnalyticsResponseBuilder builder() {
        return new AnalyticsResponseBuilder();
    }

    public static class AnalyticsResponseBuilder {
        private long totalIssues;
        private long openIssues;
        private long inProgressIssues;
        private long resolvedIssues;
        private double resolutionRate;
        private Map<String, Long> issuesByCategory;
        private Map<String, Long> issuesByStatus;

        public AnalyticsResponseBuilder totalIssues(long totalIssues) {
            this.totalIssues = totalIssues;
            return this;
        }

        public AnalyticsResponseBuilder openIssues(long openIssues) {
            this.openIssues = openIssues;
            return this;
        }

        public AnalyticsResponseBuilder inProgressIssues(long inProgressIssues) {
            this.inProgressIssues = inProgressIssues;
            return this;
        }

        public AnalyticsResponseBuilder resolvedIssues(long resolvedIssues) {
            this.resolvedIssues = resolvedIssues;
            return this;
        }

        public AnalyticsResponseBuilder resolutionRate(double resolutionRate) {
            this.resolutionRate = resolutionRate;
            return this;
        }

        public AnalyticsResponseBuilder issuesByCategory(Map<String, Long> issuesByCategory) {
            this.issuesByCategory = issuesByCategory;
            return this;
        }

        public AnalyticsResponseBuilder issuesByStatus(Map<String, Long> issuesByStatus) {
            this.issuesByStatus = issuesByStatus;
            return this;
        }

        public AnalyticsResponse build() {
            return new AnalyticsResponse(totalIssues, openIssues, inProgressIssues, resolvedIssues, resolutionRate, issuesByCategory, issuesByStatus);
        }
    }
}
