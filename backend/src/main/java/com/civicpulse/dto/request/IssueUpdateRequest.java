package com.civicpulse.dto.request;


public class IssueUpdateRequest {

    private String status;    // Will be parsed to IssueStatus enum
    private String priority;  // Will be parsed to Priority enum
    private Long assignedAdminId;
    private String comment;   // Optional comment for the status change audit trail

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public IssueUpdateRequest() {}

    public IssueUpdateRequest(String status, String priority, Long assignedAdminId, String comment) {
        this.status = status;
        this.priority = priority;
        this.assignedAdminId = assignedAdminId;
        this.comment = comment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getAssignedAdminId() {
        return assignedAdminId;
    }

    public void setAssignedAdminId(Long assignedAdminId) {
        this.assignedAdminId = assignedAdminId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public static IssueUpdateRequestBuilder builder() {
        return new IssueUpdateRequestBuilder();
    }

    public static class IssueUpdateRequestBuilder {
        private String status;
        private String priority;
        private Long assignedAdminId;
        private String comment;

        public IssueUpdateRequestBuilder status(String status) {
            this.status = status;
            return this;
        }

        public IssueUpdateRequestBuilder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public IssueUpdateRequestBuilder assignedAdminId(Long assignedAdminId) {
            this.assignedAdminId = assignedAdminId;
            return this;
        }

        public IssueUpdateRequestBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public IssueUpdateRequest build() {
            return new IssueUpdateRequest(status, priority, assignedAdminId, comment);
        }
    }
}
