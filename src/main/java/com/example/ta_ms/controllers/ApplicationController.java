package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.Application;
import com.example.ta_ms.entities.JobPosting;
import com.example.ta_ms.repositories.ApplicationRepository;
import com.example.ta_ms.repositories.JobPostingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    // Upload new application with resume
    @PostMapping("/upload")
    public ResponseEntity<String> uploadApplicationWithFile(
            @RequestParam("studentId") int studentId,
            @RequestParam("studentName") String studentName,
            @RequestParam("studentEmail") String studentEmail,
            @RequestParam("jobPostingId") int jobPostingId,
            @RequestParam("resumeFile") MultipartFile resumeFile,
            @RequestParam("interestStatement") String interestStatement,
            @RequestParam("teachingExperience") String teachingExperience,
            @RequestParam("skillsAndCoursework") String skillsAndCoursework,
            @RequestParam("additionalNotes") String additionalNotes
    ) {
        try {
            String fileType = resumeFile.getContentType();
            if (fileType == null ||
                    !(fileType.equals("application/pdf") ||
                            fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return ResponseEntity.badRequest().body("Invalid file type. Only PDF and DOCX files are allowed.");
            }

            JobPosting job = jobPostingRepository.findById(jobPostingId)
                    .orElseThrow(() -> new RuntimeException("Job posting not found"));

            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalName = resumeFile.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + originalName;
            String filePath = uploadDir + fileName;
            resumeFile.transferTo(new File(filePath));

            Application app = new Application();
            app.setJobPosting(job);
            app.setStudentId(studentId);
            app.setStudentName(studentName);
            app.setStudentEmail(studentEmail);
            app.setResume(filePath);
            app.setStatus("Submitted");
            app.setSubmissionDate(new Date());
            app.setInterestStatement(interestStatement);
            app.setTeachingExperience(teachingExperience);
            app.setSkillsAndCoursework(skillsAndCoursework);
            app.setAdditionalNotes(additionalNotes);

            Application saved = applicationRepository.save(app);

            return ResponseEntity.ok("Application submitted! Your application ID is: " + saved.getApplicationId());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading resume: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting application: " + e.getMessage());
        }
    }

    // Get all applications by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getApplicationsByStudentId(@PathVariable int studentId) {
        var applications = applicationRepository.findByStudentIdOrderBySubmissionDateDesc(studentId);
        return ResponseEntity.ok(applications);
    }

    // Update application with resume optional
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateApplicationWithFile(
            @PathVariable int id,
            @RequestParam("studentName") String studentName,
            @RequestParam("studentEmail") String studentEmail,
            @RequestParam("interestStatement") String interestStatement,
            @RequestParam("teachingExperience") String teachingExperience,
            @RequestParam("skillsAndCoursework") String skillsAndCoursework,
            @RequestParam("additionalNotes") String additionalNotes,
            @RequestParam(value = "resumeFile", required = false) MultipartFile resumeFile
    ) {
        return applicationRepository.findById(id).map(existing -> {
            if (!"Submitted".equalsIgnoreCase(existing.getStatus())) {
                return ResponseEntity.badRequest().body("Cannot edit application once reviewed.");
            }

            existing.setStudentName(studentName);
            existing.setStudentEmail(studentEmail);
            existing.setInterestStatement(interestStatement);
            existing.setTeachingExperience(teachingExperience);
            existing.setSkillsAndCoursework(skillsAndCoursework);
            existing.setAdditionalNotes(additionalNotes);
            existing.setSubmissionDate(new Date());

            try {
                if (resumeFile != null && !resumeFile.isEmpty()) {
                    String fileType = resumeFile.getContentType();
                    if (fileType == null ||
                            !(fileType.equals("application/pdf") ||
                                    fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                        return ResponseEntity.badRequest().body("Invalid file type. Only PDF and DOCX allowed.");
                    }

                    String uploadDir = System.getProperty("user.dir") + "/uploads/";
                    File dir = new File(uploadDir);
                    if (!dir.exists()) dir.mkdirs();

                    String originalName = resumeFile.getOriginalFilename().replaceAll("\\s+", "_");
                    String fileName = System.currentTimeMillis() + "_" + originalName;
                    String filePath = uploadDir + fileName;
                    resumeFile.transferTo(new File(filePath));

                    existing.setResume(filePath);
                }
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Error saving resume: " + e.getMessage());
            }

            applicationRepository.save(existing);
            return ResponseEntity.ok("Application updated successfully!");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Get single application by ID (used for pre-filling the edit form)
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable int id) {
        return applicationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasStudentApplied(
            @RequestParam int studentId,
            @RequestParam int jobPostingId) {
        boolean exists = applicationRepository.existsByStudentIdAndJobPosting_Jobid(studentId, jobPostingId);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable int id) {
        return applicationRepository.findById(id)
                .map(app -> {
                    if (!"Submitted".equalsIgnoreCase(app.getStatus())) {
                        return ResponseEntity.badRequest().body("Only applications with status 'Submitted' can be deleted.");
                    }
                    applicationRepository.delete(app);
                    return ResponseEntity.ok("Application deleted.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
