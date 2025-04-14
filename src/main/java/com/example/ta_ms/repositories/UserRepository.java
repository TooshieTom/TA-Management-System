// src/main/java/com/example/ta_ms/repositories/UserRepository.java
package com.example.ta_ms.repositories;

import com.example.ta_ms.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // For login
    Optional<User> findByEmail(String email);

    // For registration check
    boolean existsByEmail(String email);
}
