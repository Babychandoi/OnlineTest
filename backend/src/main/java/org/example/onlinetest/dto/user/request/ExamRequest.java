package org.example.onlinetest.dto.user.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.common.ExamType;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamRequest {
    String title;
    Integer duration; // phút
    String description;
    String subjectId;
    String gradeId;
    ExamType type;
    List<QuestionRequest> questions;
}
