package org.example.onlinetest.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder        // ✅ chỉ dùng SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompetitionResponse {
    String id;
    String title;
    String description;
    Integer duration;
    Boolean type;
    String startTime;
    String subjectName;
    String gradeName;
}
