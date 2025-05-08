package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.JobPosting;
import com.yourorg.yourapp.service.JobPostingService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FilterClassesController.class)
public class FilterClassesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobPostingService jobPostingService;

    @Test
    public void testGetFilteredJobPostings() throws Exception {
        List<JobPosting> jobPostings = List.of(new JobPosting(), new JobPosting());
        Mockito.when(jobPostingService
                        .filterJobPostings(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(jobPostings);

        mockMvc.perform(get("/api/jobpostings/filter")
                        .param("courseName", "Math"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }
}
