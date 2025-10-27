package org.example.onlinetest.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder        // ✅ chỉ dùng SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompetitionDetailResponse extends CompetitionResponse {
    String examName;
    List<RegisteredUser> registeredUsers;
}
