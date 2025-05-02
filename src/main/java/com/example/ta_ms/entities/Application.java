// src/main/java/com/example/ta_ms/entities/Application.java
package com.example.ta_ms.entities;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int applicationId;

    @Column(name = "student_id")
    private int studentId;

    private String studentName;
    private String studentEmail;

    @ManyToOne
    @JoinColumn(name = "jobid", nullable = false)
    private JobPosting jobPosting;

    private String status = "Submitted";
    private String resume;

    @Column(columnDefinition = "TEXT")
    private String interestStatement;

    @Column(columnDefinition = "TEXT")
    private String teachingExperience;

    @Column(columnDefinition = "TEXT")
    private String skillsAndCoursework;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Temporal(TemporalType.TIMESTAMP)
    private Date submissionDate = new Date();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;


    public Application() {}

    // Getters and Setters
    public int getApplicationId() { return applicationId; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public JobPosting getJobPosting() { return jobPosting; }
    public void setJobPosting(JobPosting jobPosting) { this.jobPosting = jobPosting; }

    public String getResume() { return resume; }
    public void setResume(String resume) { this.resume = resume; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInterestStatement() { return interestStatement; }
    public void setInterestStatement(String interestStatement) { this.interestStatement = interestStatement; }

    public String getTeachingExperience() { return teachingExperience; }
    public void setTeachingExperience(String teachingExperience) { this.teachingExperience = teachingExperience; }

    public String getSkillsAndCoursework() { return skillsAndCoursework; }
    public void setSkillsAndCoursework(String skillsAndCoursework) { this.skillsAndCoursework = skillsAndCoursework; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public Date getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(Date submissionDate) { this.submissionDate = submissionDate; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
}