
package com.wcontent.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.wcontent.model.Applicant;
import com.wcontent.model.CollabRequest;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String DEPLOYED_URL = "https://wcontent-app-in.vercel.app";

    /**
     * Sends a welcome email to a new user upon successful registration.
     *
     * @param recipientEmail The email address of the new user.
     */
    public void sendWelcomeEmail(String recipientEmail) {
        String subject = "Welcome to Wcontent! Your Creator Journey Starts Now.";
        String title = "Welcome to Wcontent!";
        String body = "<p>Hi there,</p>"
                + "<p>Thank you for joining Wcontent, the ultimate ecosystem designed to empower content creators like you. We're thrilled to have you on board!</p>"
                + "<p>You can now access all of our powerful features. Here's a glimpse of what you can do:</p>"
                + "<ul style='padding-left: 20px;'>"
                + "<li style='margin-bottom: 10px;'><strong>Generate Content:</strong> Use our AI tools to brainstorm topics, headlines, and outlines.</li>"
                + "<li style='margin-bottom: 10px;'><strong>Find Opportunities:</strong> Explore our marketplace for paid gigs and sponsorships.</li>"
                + "<li style='margin-bottom: 10px;'><strong>Collaborate:</strong> Connect with other creators to grow your audience together.</li>"
                + "</ul>"
                + getCtaButton("Go to Your Dashboard", DEPLOYED_URL + "/dashboard");

        sendStyledEmail(recipientEmail, subject, title, body);
    }

    /**
     * Notifies an opportunity poster about a new application.
     *
     * @param ownerEmail     The email of the opportunity poster.
     * @param application    The Applicant object containing applicant details.
     * @param opportunityTitle The title of the opportunity.
     * @param opportunityId  The ID of the opportunity.
     */
    public void sendNewApplicationNotification(String ownerEmail, Applicant application, String opportunityTitle,
            String opportunityId) {
        String subject = "New Application Received for \"" + opportunityTitle + "\"";
        String title = "New Application Received!";
        String body = "<p>Great news! A new creator has applied for your opportunity, <strong>\"" + opportunityTitle
                + "\"</strong>.</p>"
                + "<h3>Applicant Details:</h3>"
                + "<table border='0' cellpadding='5' cellspacing='0' style='width: 100%; border-collapse: collapse;'>"
                + "<tr><td style='width: 100px;'><strong>Name:</strong></td><td>" + application.getName() + "</td></tr>"
                + "<tr><td><strong>Email:</strong></td><td>" + application.getEmail() + "</td></tr>"
                + "<tr><td><strong>Portfolio:</strong></td><td><a href='" + application.getResumeUrl()
                + "' style='color: #008080; text-decoration: none;'>View Portfolio</a></td></tr>"
                + "<tr><td><strong>Date:</strong></td><td>" + formatDate(application.getApplicationDate())
                + "</td></tr>"
                + "</table>"
                + getCtaButton("View All Applications", DEPLOYED_URL + "/dashboard/opportunities/myopportunities");

        sendStyledEmail(ownerEmail, subject, title, body);
    }

    /**
     * Sends a confirmation email to an applicant after they apply for an opportunity.
     *
     * @param applicantEmail The email of the applicant.
     * @param opportunityTitle The title of the opportunity they applied for.
     */
    public void sendApplicationConfirmation(String applicantEmail, String opportunityTitle) {
        String subject = "Your Application for \"" + opportunityTitle + "\" has been received!";
        String title = "Application Received!";
        String body = "<p>Hi there,</p>"
                + "<p>Thank you for applying for the opportunity, <strong>\"" + opportunityTitle
                + "\"</strong> on Wcontent.</p>"
                + "<p>Your application has been successfully submitted to the opportunity poster. You can track the status of all your applications from your dashboard.</p>"
                + getCtaButton("View My Applications", DEPLOYED_URL + "/dashboard/opportunities/myapps");

        sendStyledEmail(applicantEmail, subject, title, body);
    }

    /**
     * Notifies a collaboration poster about a new request.
     *
     * @param ownerEmail   The email of the collaboration poster.
     * @param request      The CollabRequest object.
     * @param collabTitle  The title of the collaboration.
     * @param collabId     The ID of the collaboration.
     */
    public void sendNewCollabRequestNotification(String ownerEmail, CollabRequest request, String collabTitle,
            String collabId) {
        String subject = "New Collaboration Request for \"" + collabTitle + "\"";
        String title = "New Collab Request!";
        String body = "<p>Someone is excited to collaborate with you! You've received a new request for your post, <strong>\""
                + collabTitle + "\"</strong>.</p>"
                + "<h3>Requester Details:</h3>"
                + "<table border='0' cellpadding='5' cellspacing='0' style='width: 100%; border-collapse: collapse;'>"
                + "<tr><td style='width: 100px;'><strong>Name:</strong></td><td>" + request.getRequesterName()
                + "</td></tr>"
                + "<tr><td><strong>Email:</strong></td><td>" + request.getRequesterEmail() + "</td></tr>"
                + "<tr><td><strong>Date:</strong></td><td>" + formatDate(request.getAppliedDate()) + "</td></tr>"
                + "</table>"
                + "<h3 style='margin-top: 20px;'>Message:</h3>"
                + "<p style='padding: 15px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #444;'><em>\""
                + request.getMessage() + "\"</em></p>"
                + getCtaButton("View Collaboration Requests", DEPLOYED_URL + "/dashboard/collabs/myrequests");

        sendStyledEmail(ownerEmail, subject, title, body);
    }

    /**
     * Sends a confirmation email to a user after they request a collaboration.
     *
     * @param requesterEmail The email of the person who sent the request.
     * @param collabTitle    The title of the collaboration they requested.
     */
    public void sendCollabRequestConfirmation(String requesterEmail, String collabTitle) {
        String subject = "Your Collaboration Request for \"" + collabTitle + "\" has been sent!";
        String title = "Request Sent!";
        String body = "<p>Hi there,</p>"
                + "<p>Your collaboration request for <strong>\"" + collabTitle + "\"</strong> has been sent.</p>"
                + "<p>The creator has been notified. We hope this leads to an amazing partnership! You can manage your collaboration posts and requests from your dashboard.</p>"
                + getCtaButton("Go to Dashboard", DEPLOYED_URL + "/dashboard");

        sendStyledEmail(requesterEmail, subject, title, body);
    }

    /**
     * Private helper to construct and send a styled HTML email.
     *
     * @param recipientEmail The recipient's email address.
     * @param subject        The email subject.
     * @param title          The main headline in the email body.
     * @param bodyContent    The main HTML content of the email body.
     */
    private void sendStyledEmail(String recipientEmail, String subject, String title, String bodyContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8");

            String fullHtmlContent = getEmailTemplate(title, bodyContent);

            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(fullHtmlContent, true); // true = HTML content

            ClassPathResource logoResource = new ClassPathResource("static/images/wcontent-logo.png");
            helper.addInline("logo", logoResource);

            mailSender.send(message);
        } catch (MessagingException e) {
            // In a real app, you'd want more robust error handling, e.g., logging to a
            // file or service.
            e.printStackTrace();
        }
    }

    /**
     * Generates the full HTML structure for a standardized email.
     *
     * @param title The title to display in the email header.
     * @param body  The main HTML body content.
     * @return A complete HTML email string.
     */
    private String getEmailTemplate(String title, String body) {
        int year = LocalDate.now().getYear();
        return "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<style>a{color: #008080; text-decoration: none;} p{margin: 10px 0;}</style></head>"
                + "<body style='margin: 0; padding: 0; background-color: #121212; font-family: Arial, sans-serif;'>"
                + "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td style='padding: 20px 0;'>"
                + "<table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='max-width: 600px; border-collapse: collapse; background-color: #1E1E1E; border: 1px solid #333; border-radius: 10px;'>"
                // Header
                + "<tr><td align='center' style='padding: 30px 20px 20px 20px;'>"
                + "<img src='cid:logo' alt='Wcontent Logo' style='width: 80px; height: auto;'/>"
                + "<h1 style='color: #ffffff; margin: 10px 0 0 0; font-size: 24px;'>" + title + "</h1>"
                + "</td></tr>"
                // Content
                + "<tr><td style='padding: 20px 30px; color: #E0E0E0; font-size: 16px; line-height: 1.6;'>"
                + body
                + "</td></tr>"
                // Footer
                + "<tr><td style='padding: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #333;'>"
                + "<p style='margin:0;'>© " + year
                + " Wcontent. All rights reserved.</p><p style='margin:5px 0 0 0;'>If you did not request this email, please ignore it.</p>"
                + "</td></tr></table></td></tr></table></body></html>";
    }

    /**
     * Generates a styled HTML call-to-action button.
     *
     * @param text The text for the button.
     * @param url  The URL the button links to.
     * @return A string containing the HTML for the button.
     */
    private String getCtaButton(String text, String url) {
        return "<table border='0' cellpadding='0' cellspacing='0' style='margin: 30px 0;'><tr>"
                + "<td align='center'>"
                + "<a href='" + url
                + "' target='_blank' style='background-color: #008080; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'> "
                + text + "</a></td></tr></table>";
    }

    /**
     * Formats a date string into a more readable format.
     *
     * @param dateString The date string (e.g., from an ISO format).
     * @return A formatted date string (e.g., "Oct 1, 2023").
     */
    private String formatDate(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return "N/A";
        }
        try {
            // Handles ISO_LOCAL_DATE_TIME or similar formats from new Date().toISOString()
            LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_DATE_TIME);
            return date.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
        } catch (Exception e) {
            try {
                // Fallback for simple date format like YYYY-MM-DD
                LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
                return date.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
            } catch (Exception ex) {
                // If parsing fails, return the original string or a default
                return dateString;
            }
        }
    }
}
