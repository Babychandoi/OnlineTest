    package org.example.onlinetest.dto.admin.response;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import lombok.*;
    import lombok.experimental.FieldDefaults;

    import java.util.Date;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public class UserResponse {
        String id;
        String fullName;
        String email;
        String phone;
        String role; // STUDENT, TEACHER
        Boolean isPremium;
        Date startPremiumDate;
        Date endPremiumDate;
    }
