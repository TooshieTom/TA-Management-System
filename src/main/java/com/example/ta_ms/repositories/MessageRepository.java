package com.example.ta_ms.repositories;

import com.example.ta_ms.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByApplicationApplicationIdOrderBySentTimeAsc(int applicationId);

    // Count the number of unread messages for a specific application based on the type of recipient
    long countByApplicationApplicationIdAndSenderTypeAndIsRead(int applicationId, String senderType, boolean isRead);
}