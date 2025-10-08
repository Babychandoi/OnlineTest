package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.onlinetest.common.Role;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private LocalDateTime premiumExpiry; // Ngày hết hạn gói
    private LocalDateTime createdAt;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // STUDENT, TEACHER, ADMIN

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserForCompetition> competitions = new ArrayList<>();

    @ManyToMany
    @JoinTable( name = "competition_result", // bảng trung gian
    joinColumns = @JoinColumn(name = "competition_id"),
            inverseJoinColumns = @JoinColumn(name = "result_id") )
    private List<Result> results = new ArrayList<>();


}

