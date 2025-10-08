package org.example.onlinetest.mapper;

import org.example.onlinetest.dto.admin.request.UserRequest;
import org.example.onlinetest.dto.admin.response.UserResponse;
import org.example.onlinetest.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    default UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .isPremium(user.isPremium())
                .build();
    }
    default User toUser(UserRequest request) {
        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(request.getRole())
                .password(request.getPassword())
                .isPremium(false)
                .build();
    }
    default void updateUser(User user, UserRequest request) {
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword());
        }
    }
}
