package com.civicpulse.dto.response;


import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long issueId;
    private String issueTitle;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public NotificationResponse() {}

    public NotificationResponse(Long id, Long issueId, String issueTitle, String message, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.issueId = issueId;
        this.issueTitle = issueTitle;
        this.message = message;
        this.read = read;
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

    public String getIssueTitle() {
        return issueTitle;
    }

    public void setIssueTitle(String issueTitle) {
        this.issueTitle = issueTitle;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static NotificationResponseBuilder builder() {
        return new NotificationResponseBuilder();
    }

    public static class NotificationResponseBuilder {
        private Long id;
        private Long issueId;
        private String issueTitle;
        private String message;
        private boolean read;
        private LocalDateTime createdAt;

        public NotificationResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public NotificationResponseBuilder issueId(Long issueId) {
            this.issueId = issueId;
            return this;
        }

        public NotificationResponseBuilder issueTitle(String issueTitle) {
            this.issueTitle = issueTitle;
            return this;
        }

        public NotificationResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public NotificationResponseBuilder read(boolean read) {
            this.read = read;
            return this;
        }

        public NotificationResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public NotificationResponse build() {
            return new NotificationResponse(id, issueId, issueTitle, message, read, createdAt);
        }
    }
}
