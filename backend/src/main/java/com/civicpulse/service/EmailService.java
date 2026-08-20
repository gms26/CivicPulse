package com.civicpulse.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${civicpulse.frontend.url:https://civicpulse-frontend-3mb8.onrender.com}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendStatusUpdateEmail(String toEmail, String citizenName, String issueTitle,
                                       String oldStatus, String newStatus, String adminComment) {
        if (fromEmail == null || fromEmail.isEmpty()) {
            log.warn("Mail not configured (MAIL_USERNAME is empty). Skipping email to {}", toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CivicPulse — Your Issue Status Updated: " + issueTitle);

            String htmlContent = buildStatusUpdateHtml(citizenName, issueTitle, oldStatus, newStatus, adminComment);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Status update email sent to {} for issue '{}'", toEmail, issueTitle);
        } catch (MessagingException e) {
            log.error("Failed to send status update email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildStatusUpdateHtml(String citizenName, String issueTitle,
                                          String oldStatus, String newStatus, String adminComment) {
        String commentSection = "";
        if (adminComment != null && !adminComment.trim().isEmpty()) {
            commentSection = "<tr>" +
                    "<td style=\"padding: 16px 24px; background-color: #f8fafc; border-radius: 8px; margin-top: 16px;\">" +
                    "<p style=\"margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;\">Admin Comment</p>" +
                    "<p style=\"margin: 0; font-size: 14px; color: #334155; line-height: 1.5;\">" + escapeHtml(adminComment) + "</p>" +
                    "</td>" +
                    "</tr>" +
                    "<tr><td style=\"padding: 8px 0;\"></td></tr>";
        }

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset=\"UTF-8\"></head>" +
                "<body style=\"margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">" +
                "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f1f5f9; padding: 32px 16px;\">" +
                "<tr><td align=\"center\">" +
                "<table width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);\">" +

                // Header
                "<tr>" +
                "<td style=\"background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 28px 24px; text-align: center;\">" +
                "<h1 style=\"margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;\">CivicPulse</h1>" +
                "<p style=\"margin: 4px 0 0 0; color: #bfdbfe; font-size: 13px;\">Community Issue Reporting Platform</p>" +
                "</td>" +
                "</tr>" +

                // Body
                "<tr>" +
                "<td style=\"padding: 32px 24px;\">" +
                "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +

                // Greeting
                "<tr>" +
                "<td style=\"padding-bottom: 20px;\">" +
                "<p style=\"margin: 0; font-size: 15px; color: #334155;\">Hello <strong>" + escapeHtml(citizenName) + "</strong>,</p>" +
                "<p style=\"margin: 8px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;\">The status of your reported issue has been updated.</p>" +
                "</td>" +
                "</tr>" +

                // Issue title
                "<tr>" +
                "<td style=\"padding: 16px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; margin-bottom: 16px;\">" +
                "<p style=\"margin: 0 0 2px 0; font-size: 11px; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;\">Issue</p>" +
                "<p style=\"margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;\">" + escapeHtml(issueTitle) + "</p>" +
                "</td>" +
                "</tr>" +
                "<tr><td style=\"padding: 8px 0;\"></td></tr>" +

                // Status change
                "<tr>" +
                "<td style=\"padding: 20px; background-color: #f0fdf4; border-radius: 8px; text-align: center;\">" +
                "<p style=\"margin: 0 0 12px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;\">Status Change</p>" +
                "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\">" +
                "<tr>" +
                "<td style=\"padding: 6px 14px; background-color: #fee2e2; border-radius: 6px; font-size: 13px; font-weight: 600; color: #991b1b;\">" + escapeHtml(formatStatus(oldStatus)) + "</td>" +
                "<td style=\"padding: 0 12px; font-size: 18px; color: #94a3b8;\">→</td>" +
                "<td style=\"padding: 6px 14px; background-color: #dcfce7; border-radius: 6px; font-size: 13px; font-weight: 600; color: #166534;\">" + escapeHtml(formatStatus(newStatus)) + "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "<tr><td style=\"padding: 8px 0;\"></td></tr>" +

                // Admin comment
                commentSection +

                // CTA Button
                "<tr>" +
                "<td style=\"text-align: center; padding-top: 8px;\">" +
                "<a href=\"" + frontendUrl + "\" style=\"display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;\">View on CivicPulse</a>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</td>" +
                "</tr>" +

                // Footer
                "<tr>" +
                "<td style=\"padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;\">" +
                "<p style=\"margin: 0; font-size: 12px; color: #94a3b8;\">This is an automated notification from CivicPulse.</p>" +
                "<p style=\"margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;\">© 2026 CivicPulse. All rights reserved.</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</td></tr>" +
                "</table>" +
                "</body>" +
                "</html>";
    }

    private String formatStatus(String status) {
        if (status == null) return "Unknown";
        return status.replace("_", " ");
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
