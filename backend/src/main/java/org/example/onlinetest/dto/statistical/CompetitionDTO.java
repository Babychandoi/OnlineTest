package org.example.onlinetest.dto.statistical;

import lombok.*;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionDTO {
    private String id;
    private String name;
    private String description;
    private Date startDate;
    private Integer durationMinutes;
    private Boolean type; // true: Premium, false: Free
    private String examId;
    private String examTitle;
}