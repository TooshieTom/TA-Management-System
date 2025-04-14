package com.example.ta_ms.services;

import com.example.ta_ms.entities.JobPosting;
import com.example.ta_ms.repositories.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    public JobPosting saveJobPosting(JobPosting jobPosting) {
        return jobPostingRepository.save(jobPosting);
    }

    public List<JobPosting> filterJobPostings(
            String courseNumber,
            String courseName,
            String skill,
            String instructorName,
            String standing
    ) {
        List<JobPosting> postings = jobPostingRepository.findAll();

        return postings.stream().filter(posting -> {
            boolean matches = true;

            // Course number match (supports "5330" matching "CS 5330")
            if (courseNumber != null && !courseNumber.isEmpty()) {
                if (posting.getCourse() == null || posting.getCourse().getCourseNumber() == null)
                    return false;

                String fullCourseNum = posting.getCourse().getCourseNumber().toLowerCase();
                String numericPart = fullCourseNum.replaceAll("[^0-9]", "");  // strip non-digits

                matches &= fullCourseNum.contains(courseNumber.toLowerCase()) || numericPart.contains(courseNumber);
            }

            // Course name match
            if (courseName != null && !courseName.isEmpty()) {
                if (posting.getCourse() == null || posting.getCourse().getCourseName() == null)
                    return false;

                matches &= posting.getCourse().getCourseName().toLowerCase().contains(courseName.toLowerCase());
            }

            // Skill match
            if (skill != null && !skill.isEmpty()) {
                matches &= posting.getSkills() != null &&
                        posting.getSkills().toLowerCase().contains(skill.toLowerCase());
            }

            // Instructor name match
            if (instructorName != null && !instructorName.isEmpty()) {
                matches &= posting.getFacultyName() != null &&
                        posting.getFacultyName().toLowerCase().contains(instructorName.toLowerCase());
            }

            // Standing match
            if (standing != null && !standing.isEmpty()) {
                matches &= posting.getStandings() != null &&
                        posting.getStandings().stream()
                                .anyMatch(s -> s.equalsIgnoreCase(standing));
            }

            return matches;
        }).collect(Collectors.toList());
    }
}
