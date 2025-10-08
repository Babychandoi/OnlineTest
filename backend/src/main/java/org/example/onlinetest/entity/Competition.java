package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Builder
@Entity
@Table(name = "competitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    private String description;

    private Date startDate;

    private Integer durationMinutes; // Thời gian thi (phút)

    private Boolean type; // true: Premium, false: Free
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;
    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserForCompetition> registeredUsers = new ArrayList<>();
}
