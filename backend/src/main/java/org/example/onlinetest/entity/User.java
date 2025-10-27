package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.onlinetest.common.Role;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String fullName;

    private String email;

    @Column(unique = true, nullable = false)
    private  String phone;

    private boolean isPremium;
    private Date premiumExpiry; // Ngày hết hạn gói
    private Date premiumStart; // Ngày bắt đầu gói
    private String password;

    @CreationTimestamp
    LocalDateTime createAt;
    @Enumerated(EnumType.STRING)
    private Role role; // STUDENT, TEACHER, ADMIN

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserForCompetition> competitions = new ArrayList<>();


}

