package org.example.onlinetest.dto.user.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultResponse {
    String id;
    String examTitle;
    Integer score;
    Integer totalQuestionsCorrect;
    Date submittedAt;
    Integer totalQuestions;
    String grade;
    String subject;
    Integer totalScore;
}
