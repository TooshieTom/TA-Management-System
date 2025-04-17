package com.example.ta_ms.controllers;

import com.example.ta_ms.entities.Application;
import com.example.ta_ms.repositories.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable int id,
            @RequestParam String status) {
        return applicationRepository.findById(id)
                .map(app -> {
                    app.setStatus(status);
                    applicationRepository.save(app);
                    return ResponseEntity.ok("Status updated");
                })
                .orElse(ResponseEntity.notFound().build());
    }

}