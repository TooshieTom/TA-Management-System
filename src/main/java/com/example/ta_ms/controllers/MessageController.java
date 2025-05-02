package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.Application;
import com.example.ta_ms.entities.Message;
import com.example.ta_ms.repositories.ApplicationRepository;
import com.example.ta_ms.repositories.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // Get all messages for an application
    @GetMapping("/{applicationId}")
    public ResponseEntity<?> getMessages(@PathVariable int applicationId) {
        List<Message> messages = messageRepository.findByApplicationApplicationIdOrderBySentTimeAsc(applicationId);
        return ResponseEntity.ok(messages);
    }

    // Send a new message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestParam int applicationId,
            @RequestParam String content,
            @RequestParam String senderType) {

        // Try to find an application by ID
        return applicationRepository.findById(applicationId)
                .map(application -> {
                    // Create and save a new message if the application exists
                    Message message = new Message();
                    message.setApplication(application);
                    message.setContent(content);
                    message.setSenderType(senderType);
                    message.setSentTime(new Date());
                    message.setRead(false);

                    Message saved = messageRepository.save(message);
                    return ResponseEntity.ok(saved);
                })
                // Return an error if the application is not found by id
                .orElseGet(() -> {
                    Message errorMessage = new Message();
                    errorMessage.setContent("Application not found");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
                });
    }

    // Mark messages as read
    @PutMapping("/{applicationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable int applicationId,
            @RequestParam String recipientType) {

        // Determine the sender type based on the recipient type
        String senderType = "FACULTY".equals(recipientType) ? "STUDENT" : "FACULTY";

        // Find all messages for the application by sent time ascending
        List<Message> messages = messageRepository.findByApplicationApplicationIdOrderBySentTimeAsc(applicationId);

        // Mark messages from the opposite recipient type as seen
        for (Message message : messages) {
            if (message.getSenderType().equals(senderType) && !message.isRead()) {
                message.setRead(true);
                messageRepository.save(message);
            }
        }

        return ResponseEntity.ok("Messages marked as read");
    }

    // Get unread message counts
    @GetMapping("/unread/{applicationId}")
    public ResponseEntity<?> getUnreadCounts(@PathVariable int applicationId) {
        Map<String, Long> unreadCounts = new HashMap<>();

        // Count unread messages from both the students and faculty
        long unreadFromStudents = messageRepository.countByApplicationApplicationIdAndSenderTypeAndIsRead(
                applicationId, "STUDENT", false);
        long unreadFromFaculty = messageRepository.countByApplicationApplicationIdAndSenderTypeAndIsRead(
                applicationId, "FACULTY", false);

        // Add counts to response map
        unreadCounts.put("unreadFromStudents", unreadFromStudents);
        unreadCounts.put("unreadFromFaculty", unreadFromFaculty);

        return ResponseEntity.ok(unreadCounts);
    }
}