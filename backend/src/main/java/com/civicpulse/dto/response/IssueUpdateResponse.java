package com.civicpulse.dto.response;

import java.time.LocalDateTime;

public class IssueUpdateResponse {

    private Long id;
    private Long issueId;
    private String updatedByName;
    private String oldStatus;
    private String newStatus;
    private String comment;
    private LocalDateTime createdAt;

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public IssueUpdateResponse() {}

    public IssueUpdateResponse(Long id, Long issueId, String updatedByName, String oldStatus, String newStatus, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.issueId = issueId;
        this.updatedByName = updatedByName;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIssueId() {
        return issueId;
    }

    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }

    public String getUpdatedByName() {
        return updatedByName;
    }

    public void setUpdatedByName(String updatedByName) {
        this.updatedByName = updatedByName;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static IssueUpdateResponseBuilder builder() {
        return new IssueUpdateResponseBuilder();
    }

    public static class IssueUpdateResponseBuilder {
        private Long id;
        private Long issueId;
        private String updatedByName;
        private String oldStatus;
        private String newStatus;
        private String comment;
        private LocalDateTime createdAt;

        public IssueUpdateResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public IssueUpdateResponseBuilder issueId(Long issueId) {
            this.issueId = issueId;
            return this;
        }

        public IssueUpdateResponseBuilder updatedByName(String updatedByName) {
            this.updatedByName = updatedByName;
            return this;
        }

        public IssueUpdateResponseBuilder oldStatus(String oldStatus) {
            this.oldStatus = oldStatus;
            return this;
        }

        public IssueUpdateResponseBuilder newStatus(String newStatus) {
            this.newStatus = newStatus;
            return this;
        }

        public IssueUpdateResponseBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public IssueUpdateResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public IssueUpdateResponse build() {
            return new IssueUpdateResponse(id, issueId, updatedByName, oldStatus, newStatus, comment, createdAt);
        }
    }
}
