
package com.wcontent.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String recipientEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            // Build the HTML content for the email
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6;\">"
                    + "<div style=\"max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;\">"
                    + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                    // Use 'cid:logo' to reference the inline image
                    + "<img src='cid:logo' alt='Wcontent Logo' style='width: 80px; height: auto;'/>"
                    + "<h1 style=\"color: #008080;\">Welcome to Wcontent!</h1>"
                    + "</div>"
                    + "<p>Hi there,</p>"
                    + "<p>Thank you for joining Wcontent, the ultimate ecosystem designed to empower content creators like you. We're thrilled to have you on board!</p>"
                    + "<p>You've successfully registered and can now access all of our powerful features. Here's a glimpse of what you can do:</p>"
                    + "<ul style=\"list-style-type: none; padding: 0;\">"
                    + "<li style=\"margin-bottom: 15px;\">"
                    + "<h4 style=\"margin: 0 0 5px 0; color: #008080;\">&#128161; Generate Content Ideas</h4>"
                    + "<p style=\"margin: 0;\">Never run out of inspiration. Use our AI tools to brainstorm unique topics, craft catchy headlines, and build structured outlines for your next masterpiece.</p>"
                    + "</li>"
                    + "<li style=\"margin-bottom: 15px;\">"
                    + "<h4 style=\"margin: 0 0 5px 0; color: #008080;\">&#128188; Find Opportunities</h4>"
                    + "<p style=\"margin: 0;\">Explore our marketplace to find paid gigs, sponsorships, and projects from brands looking for your unique talent.</p>"
                    + "</li>"
                    + "<li style=\"margin-bottom: 15px;\">"
                    + "<h4 style=\"margin: 0 0 5px 0; color: #008080;\">&#129309; Collaborate with Creators</h4>"
                    + "<p style=\"margin: 0;\">Connect with other creators in our hub. Propose joint projects, find partners for co-hosted streams, and grow your audience together.</p>"
                    + "</li>"
                    + "</ul>"
                    + "<div style=\"text-align: center; margin-top: 30px;\">"
                    // Replace with your actual frontend URL
                    + "<a href=\"https://wcontent-app.com/dashboard\" style=\"background-color: #008080; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Go to Your Dashboard</a>"
                    + "</div>"
                    + "<p style=\"margin-top: 30px; font-size: 12px; color: #888;\">If you have any questions, just reply to this email. We're always happy to help.</p>"
                    + "<p style=\"font-size: 12px; color: #888;\">Best,<br/>The Wcontent Team</p>"
                    + "</div>"
                    + "</div>";

            helper.setTo(recipientEmail);
            helper.setSubject("Welcome to Wcontent! Your Creator Journey Starts Now.");
            helper.setText(htmlContent, true); // true = HTML content

            // Add the logo as an inline attachment.
            // This requires a 'wcontent-logo.png' in 'src/main/resources/static/images/'
            ClassPathResource logoResource = new ClassPathResource("static/images/wcontent-logo.png");
            helper.addInline("logo", logoResource);

            mailSender.send(message);
        } catch (MessagingException e) {
            // In a real app, you'd want more robust error handling
            e.printStackTrace();
        }
    }
}
