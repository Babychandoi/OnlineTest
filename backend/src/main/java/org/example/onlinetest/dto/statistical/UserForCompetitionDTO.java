package org.example.onlinetest.dto.statistical;

import lombok.*;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserForCompetitionDTO {
    private String id;
    private String competitionId;
    private String competitionName;
    private String userId;
    private String userName;
    private Boolean hasParticipated;
    private Date registeredAt;
    private ResultDTO result; // null nếu chưa thi
}
