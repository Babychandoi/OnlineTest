package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Builder
@Entity
@Table(name = "grades")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;        // Ví dụ: "Lớp 6", "Lớp 12", "Đại học"
    @OneToMany(mappedBy = "grade", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SubjectOfGrade> gradeSubjects = new HashSet<>();
}
