package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.JobPosting;
import com.example.ta_ms.services.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobpostings")
@CrossOrigin(origins = "http://localhost:3000")
public class FilterClassesController {

    @Autowired
    private JobPostingService jobPostingService;

    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredJobPostings(
            @RequestParam(required = false) String courseNumber,
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String instructorName,
            @RequestParam(required = false) String standing
    ) {
        try {
            List<JobPosting> postings = jobPostingService.filterJobPostings(
                    courseNumber, courseName, skill, instructorName, standing
            );

            return ResponseEntity.ok(postings);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error filtering job postings: " + e.getMessage());
        }
    }
}
