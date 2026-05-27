package com.civicpulse.entity;

import com.civicpulse.entity.enums.IssueStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_updates")
public class IssueUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
        private Issue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
        private User updatedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status", length = 20)
    private IssueStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", length = 20)
    private IssueStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public IssueUpdate() {}

    public IssueUpdate(Long id, Issue issue, User updatedBy, IssueStatus oldStatus, IssueStatus newStatus, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.issue = issue;
        this.updatedBy = updatedBy;
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

    public Issue getIssue() {
        return issue;
    }

    public void setIssue(Issue issue) {
        this.issue = issue;
    }

    public User getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(User updatedBy) {
        this.updatedBy = updatedBy;
    }

    public IssueStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(IssueStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public IssueStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(IssueStatus newStatus) {
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

    public static IssueUpdateBuilder builder() {
        return new IssueUpdateBuilder();
    }

    public static class IssueUpdateBuilder {
        private Long id;
        private Issue issue;
        private User updatedBy;
        private IssueStatus oldStatus;
        private IssueStatus newStatus;
        private String comment;
        private LocalDateTime createdAt;

        public IssueUpdateBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public IssueUpdateBuilder issue(Issue issue) {
            this.issue = issue;
            return this;
        }

        public IssueUpdateBuilder updatedBy(User updatedBy) {
            this.updatedBy = updatedBy;
            return this;
        }

        public IssueUpdateBuilder oldStatus(IssueStatus oldStatus) {
            this.oldStatus = oldStatus;
            return this;
        }

        public IssueUpdateBuilder newStatus(IssueStatus newStatus) {
            this.newStatus = newStatus;
            return this;
        }

        public IssueUpdateBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public IssueUpdateBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public IssueUpdate build() {
            return new IssueUpdate(id, issue, updatedBy, oldStatus, newStatus, comment, createdAt);
        }
    }
}
