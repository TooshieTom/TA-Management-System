// src/main/java/com/example/ta_ms/repositories/ApplicationRepository.java
package com.example.ta_ms.repositories;

import com.example.ta_ms.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    //Custom query to fetch a student's applications sorted by newest submission date
    List<Application> findByStudentIdOrderBySubmissionDateDesc(int studentId);

    boolean existsByStudentIdAndJobPosting_Jobid(int studentId, int jobid);

    List<Application> findByJobPostingFacultyEmailOrderBySubmissionDateDesc(String facultyEmail);

}