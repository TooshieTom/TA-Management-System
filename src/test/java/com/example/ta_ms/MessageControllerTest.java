package com.yourorg.yourapp.controller;

import com.yourorg.yourapp.model.Message;
import com.yourorg.yourapp.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MessageController.class)
public class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MessageRepository messageRepository;

    @Test
    public void testSendMessage() throws Exception {
        mockMvc.perform(post("/api/messages/send")
                        .param("applicationId", "1")
                        .param("content", "Test message")
                        .param("senderType", "STUDENT"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetMessages() throws Exception {
        List<Message> messages = List.of(new Message(), new Message());
        Mockito.when(messageRepository
                        .findByApplicationApplicationIdOrderBySentTimeAsc(1))
                .thenReturn(messages);

        mockMvc.perform(get("/api/messages/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }
}
