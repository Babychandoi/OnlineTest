package org.example.onlinetest.dto.statistical;

import lombok.*;
import org.example.onlinetest.common.Role;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime createAt;
    private boolean isPremium;
}
