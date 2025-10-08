package org.example.onlinetest.dto.admin.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompetitionRequest {
    String title;
    String description;
    String examId;
    Date startTime;
    Boolean type; // true for Premium, false for Free
}
