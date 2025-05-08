package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.User;
import com.yourorg.yourapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void testLoginSuccess() throws Exception {
        User user = new User("student@example.com", "$2a$10$encryptedPassword", "student", 123);
        Mockito.when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"student@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("student"))
                .andExpect(jsonPath("$.userId").value(123));
    }

    @Test
    public void testRegisterEmailExists() throws Exception {
        Mockito.when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"duplicate@example.com\",\"password\":\"password123\",\"role\":\"student\",\"userId\":123}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already in use."));
    }
}
