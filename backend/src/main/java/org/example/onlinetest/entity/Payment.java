package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Builder
@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;

    private String method; // VNPay, Momo, ZaloPay
    private Double amount;
    private LocalDateTime createdAt;

    private boolean success;
}
