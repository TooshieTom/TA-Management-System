package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.User;
import com.example.ta_ms.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Request payloads
    public record RegisterRequest(String email, String password, String role, Integer userId) {}
    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String role, int userId) {}

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        if (request.userId() == null) {
            return ResponseEntity.badRequest().body("User ID (Student/Faculty ID) is required.");
        }

        String encryptedPassword = passwordEncoder.encode(request.password());
        User user = new User(request.email(), encryptedPassword, request.role().toLowerCase(), request.userId());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.email());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        // Return role and userId
        return ResponseEntity.ok(new LoginResponse(user.getRole(), user.getUserId()));
    }
}
