package org.example.onlinetest.dto.admin.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.common.Role;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserRequest {
    String fullName;
    String email;
    String password;
    String phone;
    Role role; // STUDENT, TEACHER, ADMIN
    Boolean isPremium;
    Date  startPremiumDate;
    Date endPremiumDate;
}
