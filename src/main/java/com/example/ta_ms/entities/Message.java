package com.example.ta_ms.entities;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageId;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String senderType; // "STUDENT" or "FACULTY"

    private boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date sentTime = new Date();

    public Message() {}

    // Getters and Setters
    public int getMessageId() { return messageId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public Date getSentTime() { return sentTime; }
    public void setSentTime(Date sentTime) { this.sentTime = sentTime; }
}