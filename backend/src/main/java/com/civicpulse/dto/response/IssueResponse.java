package com.civicpulse.dto.response;


import java.time.LocalDateTime;

public class IssueResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String categoryDisplayName;
    private String status;
    private String statusDisplayName;
    private String priority;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private String imageUrl;

    // Reporter info
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;

    // Assigned admin info
    private Long assignedAdminId;
    private String assignedAdminName;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public IssueResponse() {}

    public IssueResponse(Long id, String title, String description, String category, String categoryDisplayName, String status, String statusDisplayName, String priority, String locationAddress, Double latitude, Double longitude, String imageUrl, Long reporterId, String reporterName, String reporterEmail, Long assignedAdminId, String assignedAdminName, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.categoryDisplayName = categoryDisplayName;
        this.status = status;
        this.statusDisplayName = statusDisplayName;
        this.priority = priority;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.reporterEmail = reporterEmail;
        this.assignedAdminId = assignedAdminId;
        this.assignedAdminName = assignedAdminName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public Long getAssignedAdminId() {
        return assignedAdminId;
    }

    public void setAssignedAdminId(Long assignedAdminId) {
        this.assignedAdminId = assignedAdminId;
    }

    public String getAssignedAdminName() {
        return assignedAdminName;
    }

    public void setAssignedAdminName(String assignedAdminName) {
        this.assignedAdminName = assignedAdminName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public static IssueResponseBuilder builder() {
        return new IssueResponseBuilder();
    }

    public static class IssueResponseBuilder {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String categoryDisplayName;
        private String status;
        private String statusDisplayName;
        private String priority;
        private String locationAddress;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private Long reporterId;
        private String reporterName;
        private String reporterEmail;
        private Long assignedAdminId;
        private String assignedAdminName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime resolvedAt;

        public IssueResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public IssueResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public IssueResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public IssueResponseBuilder category(String category) {
            this.category = category;
            return this;
        }

        public IssueResponseBuilder categoryDisplayName(String categoryDisplayName) {
            this.categoryDisplayName = categoryDisplayName;
            return this;
        }

        public IssueResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public IssueResponseBuilder statusDisplayName(String statusDisplayName) {
            this.statusDisplayName = statusDisplayName;
            return this;
        }

        public IssueResponseBuilder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public IssueResponseBuilder locationAddress(String locationAddress) {
            this.locationAddress = locationAddress;
            return this;
        }

        public IssueResponseBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public IssueResponseBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public IssueResponseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public IssueResponseBuilder reporterId(Long reporterId) {
            this.reporterId = reporterId;
            return this;
        }

        public IssueResponseBuilder reporterName(String reporterName) {
            this.reporterName = reporterName;
            return this;
        }

        public IssueResponseBuilder reporterEmail(String reporterEmail) {
            this.reporterEmail = reporterEmail;
            return this;
        }

        public IssueResponseBuilder assignedAdminId(Long assignedAdminId) {
            this.assignedAdminId = assignedAdminId;
            return this;
        }

        public IssueResponseBuilder assignedAdminName(String assignedAdminName) {
            this.assignedAdminName = assignedAdminName;
            return this;
        }

        public IssueResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public IssueResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public IssueResponseBuilder resolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public IssueResponse build() {
            return new IssueResponse(id, title, description, category, categoryDisplayName, status, statusDisplayName, priority, locationAddress, latitude, longitude, imageUrl, reporterId, reporterName, reporterEmail, assignedAdminId, assignedAdminName, createdAt, updatedAt, resolvedAt);
        }
    }
}
