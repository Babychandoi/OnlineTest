package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.response.UserResponse;
import org.example.onlinetest.service.UserService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class UserController {
     UserService userService;
     @PutMapping("/update")
    ApiResponse<Boolean> updateUser(@RequestBody  UserResponse userResponse){
         return ApiResponse.<Boolean>builder()
                 .data(userService.updateUser(userResponse))
                 .message("Update user successfully")
                 .build();
     }

}
