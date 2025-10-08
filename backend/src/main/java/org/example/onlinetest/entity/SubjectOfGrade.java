package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "grade_subjects",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"grade_id", "subject_id"})
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubjectOfGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "grade_id", nullable = false)
    private Grade grade;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
}
