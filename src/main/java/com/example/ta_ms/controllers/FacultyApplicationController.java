package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.Application;
import com.example.ta_ms.repositories.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/faculty")
@CrossOrigin(origins = "http://localhost:3000")
public class FacultyApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/{facultyEmail:.+}")
    public ResponseEntity<?> getApplicationsForFaculty(@PathVariable String facultyEmail) {
        List<Application> applications =
                applicationRepository.findByJobPostingFacultyEmailOrderBySubmissionDateDesc(facultyEmail);
        return ResponseEntity.ok(applications);
    }
}

