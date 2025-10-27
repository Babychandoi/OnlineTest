package org.example.onlinetest.dto.admin.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder        // ✅ chỉ dùng SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompetitionResponse {
    String id;
    String title;
    String description;
    Integer duration;
    Boolean type;
    String startTime;
    String subjectName;
    String gradeName;
    String examId;
    String examName;
    Integer registerStudent;
}
