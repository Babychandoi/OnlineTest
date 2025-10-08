package org.example.onlinetest.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;

import java.util.ArrayList;
import java.util.List;
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompetitionExamResponse extends CompetitionResponse {
    ExamDetailResponse competitionExam;
}
