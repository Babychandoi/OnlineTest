package org.example.onlinetest.dto.statistical;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultDTO {
    private String id;
    private String studentId;
    private String studentName;
    private String examId;
    private String examTitle;
    private int score;
    private int totalScore;
    private int totalQuestionsCorrect;
    private Date submittedAt;
}
