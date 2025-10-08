    package org.example.onlinetest.dto.admin.response;

    import lombok.*;
    import lombok.experimental.FieldDefaults;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public class UserResponse {
        String id;
        String fullName;
        String email;
        String phone;
        String role; // STUDENT, TEACHER, ADMIN
        Boolean isPremium;
    }
