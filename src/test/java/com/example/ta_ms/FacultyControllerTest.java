package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.Application;
import com.yourorg.yourapp.repository.ApplicationRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FacultyApplicationController.class)
public class FacultyApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationRepository applicationRepository;

    @Test
    public void testGetApplicationsForFaculty() throws Exception {
        List<Application> applications = List.of(
                new Application(/* ... */),
                new Application(/* ... */)
        );
        Mockito.when(applicationRepository
                        .findByJobPostingFacultyEmailOrderBySubmissionDateDesc(Mockito.anyString()))
                .thenReturn(applications);

        mockMvc.perform(get("/api/applications/faculty/test@faculty.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }
}
