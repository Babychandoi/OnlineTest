package org.example.onlinetest.dto.statistical;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDataDTO {
    private List<UserDTO> users;
    private List<ExamDTO> exams;
    private List<CompetitionDTO> competitions;
    private List<ResultDTO> results;
    private List<UserForCompetitionDTO> userCompetitions;
}
