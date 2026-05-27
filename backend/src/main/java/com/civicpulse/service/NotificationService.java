package com.civicpulse.service;

import com.civicpulse.dto.response.NotificationResponse;
import com.civicpulse.entity.Issue;
import com.civicpulse.entity.Notification;
import com.civicpulse.entity.User;
import com.civicpulse.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void sendStatusUpdate(Issue issue, User recipient, String oldStatus, String newStatus, String comment) {
        if (recipient == null) {
            return;
        }

        String message = String.format("Your issue '%s' status changed from %s to %s.", 
                issue.getTitle(), oldStatus, newStatus);
                
        if (comment != null && !comment.trim().isEmpty()) {
            message += " Comment: " + comment;
        }

        Notification notification = new Notification();
        notification.setIssue(issue);
        notification.setUser(recipient);
        notification.setMessage(message);
        
        Notification savedNotification = notificationRepository.save(notification);
        
        NotificationResponse response = mapToResponse(savedNotification);
        
        // Push to WebSocket queue for this specific user
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(), 
                "/queue/notifications", 
                response
        );
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsForUser(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getUser().getId().equals(userId)) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setIssueId(notification.getIssue().getId());
        response.setIssueTitle(notification.getIssue().getTitle());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
