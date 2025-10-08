package org.example.onlinetest.dto.user.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;

@Getter
@Setter
@SuperBuilder       // ✅ kế thừa builder từ class cha
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompetitionForMeResponse extends CompetitionResponse {
    Boolean isRegistered;
    Boolean isCompleted;
}
