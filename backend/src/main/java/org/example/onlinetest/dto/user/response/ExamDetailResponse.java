package org.example.onlinetest.dto.user.response;

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
public class ExamDetailResponse {
    String id;
    String title;
    Integer duration; // phút
    ExamType type;
    Integer totalQuestions;
    Integer totalScore;
    Boolean active;
    List<QuestionResponse> questions;
}
