package org.example.onlinetest.dto.admin.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.common.ExamType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamResponse {
    String id;
    String title;
    Integer duration; // phút
    ExamType type;
    String teacherName;
    String teacherId;
    String subjectId;
    String subjectName;
    String gradeName;
    String gradeId;
    Boolean active;
    Integer totalQuestions;
    Integer totalScore;
}

