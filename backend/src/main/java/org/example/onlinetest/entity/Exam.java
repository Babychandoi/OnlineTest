package org.example.onlinetest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.onlinetest.common.ExamType;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Table(name = "exams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;       // Tên đề thi
    private String description; // Mô tả

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;       // Người tạo đề

    @Enumerated(EnumType.STRING)
    private ExamType type;      // FREE, FEE

    private int totalQuestions; // Tổng số câu hỏi
    private int totalScore;     // Tổng điểm
    private int durationMinutes; // Thời gian làm bài (phút)
    @Column(name = "is_active")
    private boolean active; // Trạng thái kích hoạt
    @ManyToOne
    @JoinColumn(name = "grade_subject_id")
    private SubjectOfGrade subjectOfGrade;        // Khối lớp

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<Competition> competitions = new ArrayList<>();

    @CreationTimestamp
    LocalDateTime createAt;

}


