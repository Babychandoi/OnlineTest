package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Builder
@Entity
@Table(name = "results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User student;

    @ManyToOne
    private Exam exam;


    private int score;
    private int totalQuestionsCorrect;
    @CreationTimestamp
    private Date submittedAt;
}

