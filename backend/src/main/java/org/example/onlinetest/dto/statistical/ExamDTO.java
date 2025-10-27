package org.example.onlinetest.dto.statistical;

import lombok.*;
import org.example.onlinetest.common.ExamType;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    private String id;
    private String title;
    private String description;
    private String teacherId;
    private String teacherName;
    private ExamType type;
    private int totalQuestions;
    private int totalScore;
    private int durationMinutes;
    private LocalDateTime createAt;
}
