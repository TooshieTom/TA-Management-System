package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.Course;
import com.yourorg.yourapp.repository.CourseRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
public class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseRepository courseRepository;

    @Test
    public void testAddCourse() throws Exception {
        Course course = new Course("CSC101", "Intro to CS", "Basics of CS");
        Mockito.when(courseRepository.save(Mockito.any(Course.class))).thenReturn(course);

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseNumber\":\"CSC101\",\"courseName\":\"Intro to CS\",\"description\":\"Basics of CS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseNumber").value("CSC101"));
    }

    @Test
    public void testGetAllCourses() throws Exception {
        List<Course> courses = List.of(
                new Course("CSC101", "Intro to CS", "Basics"),
                new Course("MAT101", "Calculus", "Intro to Calculus")
        );
        Mockito.when(courseRepository.findAll()).thenReturn(courses);

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }
}
