// src/test/java/com/yourorg/yourapp/controller/ApplicationControllerTest.java
package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.Application;
import com.yourorg.yourapp.repository.ApplicationRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationRepository applicationRepository;

    @Test
    public void testUpdateApplicationStatus() throws Exception {
        Application application = new Application();
        Mockito.when(applicationRepository.findById(1)).thenReturn(Optional.of(application));

        mockMvc.perform(put("/api/applications/1/status")
                        .param("status", "Approved"))
                .andExpect(status().isOk())
                .andExpect(content().string("Status updated"));

        Mockito.verify(applicationRepository, times(1)).save(Mockito.any(Application.class));
    }

    @Test
    public void testUpdateStatusApplicationNotFound() throws Exception {
        Mockito.when(applicationRepository.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/applications/1/status")
                        .param("status", "Approved"))
                .andExpect(status().isNotFound());
    }
}
