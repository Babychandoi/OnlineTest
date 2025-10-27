package org.example.onlinetest.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.util.List;
@Builder
@Document(collection = "questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Question {
    @Id
    private String id;

    private String examId; // mapping sang Exam (MySQL)
    private String content; // Nội dung câu hỏi
    private String image; // link ảnh (nếu có)
    private int score; // điểm câu hỏi
    private List<String> answers; // các lựa chọn
    private String correct; // đáp án đúng
}
    