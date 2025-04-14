package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.Course;
import com.example.ta_ms.entities.JobPosting;
import com.example.ta_ms.repositories.CourseRepository;
import com.example.ta_ms.repositories.JobPostingRepository;
import com.example.ta_ms.services.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/jobpostings")
@CrossOrigin(origins = "http://localhost:3000")
public class PostJobController {

    @Autowired
    private JobPostingService jobPostingService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @PostMapping
    public JobPosting createJobPosting(@RequestBody JobPosting jobData) {
        // Ensure the primary course exists in the database.
        if (jobData.getCourse() != null && jobData.getCourse().getCourseNumber() != null) {
            Course existingCourse = courseRepository.findById(jobData.getCourse().getCourseNumber()).orElse(null);
            if (existingCourse != null) {
                jobData.setCourse(existingCourse);
            } else {
                // Create and persist the new course.
                Course newCourse = new Course(
                        jobData.getCourse().getCourseNumber(),
                        jobData.getCourse().getCourseName(),
                        jobData.getCourse().getDescription()
                );
                courseRepository.save(newCourse);
                jobData.setCourse(newCourse);
            }
        }

        // For each required course, ensure we use the persisted version.
        if (jobData.getRequiredCourses() != null && !jobData.getRequiredCourses().isEmpty()) {
            jobData.setRequiredCourses(
                    jobData.getRequiredCourses().stream().map(course -> {
                        if (course.getCourseNumber() != null) {
                            return courseRepository.findById(course.getCourseNumber())
                                    .orElseGet(() -> {
                                        Course newReqCourse = new Course(
                                                course.getCourseNumber(),
                                                course.getCourseName(),
                                                course.getDescription()
                                        );
                                        return courseRepository.save(newReqCourse);
                                    });
                        }
                        return course;
                    }).collect(java.util.stream.Collectors.toSet())
            );
        }

        // Save and return the job posting.
        return jobPostingService.saveJobPosting(jobData);
    }

    @GetMapping("/{id}")
    public JobPosting getJobPostingById(@PathVariable int id) {
        Optional<JobPosting> posting = jobPostingRepository.findById(id);
        if (posting.isPresent()) {
            return posting.get();
        } else {
            throw new RuntimeException("Job posting not found with ID: " + id);
        }
    }
}
