package com.example.demo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.wcontent.service.EmailService;
import com.example.demo.model.Applicant;
import com.example.demo.model.PostOpportunity;
import com.example.demo.repository.PostOpportunityRepository;

@RestController
@RequestMapping("/api/users/application")
public class ApplicantsController {

    @Autowired
    private PostOpportunityRepository postOpportunityRepository;
    @Autowired
    private EmailService emailService;

    @PostMapping("/opportunity/{id}/apply")
    public ResponseEntity<?> applyToOpportunity(
            @PathVariable("id") String opportunityId,
            @RequestBody Applicant applicant) {

        Optional<PostOpportunity> optionalOpportunity = postOpportunityRepository.findById(opportunityId);
        if (!optionalOpportunity.isPresent()) {
            return new ResponseEntity<>("Opportunity not found", HttpStatus.NOT_FOUND);
        }
        PostOpportunity opportunity = optionalOpportunity.get();
        if (opportunity.getApplicants() == null) {
            opportunity.setApplicants(new ArrayList<>());
        }
        opportunity.getApplicants().add(applicant);
        postOpportunityRepository.save(opportunity);

        // Notify the opportunity owner
        emailService.sendNewApplicationNotification(opportunity.getEmail(), applicant, opportunity.getTitle(),
                opportunity.getId());

        // Send confirmation to the applicant
        emailService.sendApplicationConfirmation(applicant.getEmail(), opportunity.getTitle());

        return new ResponseEntity<>("Application submitted successfully", HttpStatus.OK);
    }

    @GetMapping("/opportunity/{id}/applicants")
    public ResponseEntity<?> getApplicantsForOpportunity(@PathVariable("id") String opportunityId) {
        Optional<PostOpportunity> optionalOpportunity = postOpportunityRepository.findById(opportunityId);
        if (!optionalOpportunity.isPresent()) {
            return new ResponseEntity<>("Opportunity not found", HttpStatus.NOT_FOUND);
        }
        PostOpportunity opportunity = optionalOpportunity.get();
        return new ResponseEntity<>(opportunity.getApplicants(), HttpStatus.OK);
    }

    @GetMapping("/myApplications/{userId}")
    public ResponseEntity<?> getMyApplications(@PathVariable("userId") String userId) {
        List<PostOpportunity> allOpportunities = postOpportunityRepository.findAll();
        List<Map<String, Object>> myApplications = new ArrayList<>();

        for (PostOpportunity opportunity : allOpportunities) {
            if (opportunity.getApplicants() != null) {
                for (Applicant applicant : opportunity.getApplicants()) {
                    // Assuming the Applicant object contains the applicant's userId
                    if (userId.equals(applicant.getUserId())) {
                        Map<String, Object> applicationDetails = new HashMap<>();
                        applicationDetails.put("opportunity", opportunity);
                        applicationDetails.put("_id", applicant.getId()); // Assuming a unique ID for the application
                        applicationDetails.put("applicationDate", applicant.getApplicationDate());
                        applicationDetails.put("resumeUrl", applicant.getResumeUrl());
                        applicationDetails.put("name", applicant.getName());
                        applicationDetails.put("email", applicant.getEmail());
                        myApplications.add(applicationDetails);
                    }
                }
            }
        }
        return new ResponseEntity<>(myApplications, HttpStatus.OK);
    }

}
