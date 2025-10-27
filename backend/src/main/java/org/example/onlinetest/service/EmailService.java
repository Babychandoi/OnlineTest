package org.example.onlinetest.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String token);
}
