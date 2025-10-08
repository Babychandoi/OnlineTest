package org.example.onlinetest.service;

import org.example.onlinetest.dto.admin.response.UserResponse;

public interface UserService {
    Boolean updateUser(UserResponse userResponse);
}
