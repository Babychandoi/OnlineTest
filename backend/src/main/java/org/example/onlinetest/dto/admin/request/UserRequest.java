package org.example.onlinetest.dto.admin.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.common.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    String fullName;
    String email;
    String password;
    String phone;
    Role role; // STUDENT, TEACHER, ADMIN
}
