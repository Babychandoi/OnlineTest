package org.example.onlinetest.controller;

import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.request.*;
import org.example.onlinetest.dto.admin.response.AuthenticationResponse;
import org.example.onlinetest.dto.admin.response.IntrospectResponse;
import org.example.onlinetest.dto.admin.response.UserResponse;
import org.example.onlinetest.service.AuthenticationService;
import org.example.onlinetest.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class AuthenticationController {
    AuthenticationService authenticationService;
    PasswordResetService passwordResetService;
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .data(result)
                .message(result.isAuthenticated() ? "Login successful" : "Login failed")
                .build();

    }
    @PostMapping("/users")
    ApiResponse<Boolean> createUser(@RequestBody UserRequest request) {
        return ApiResponse.<Boolean>builder()
                .data(authenticationService.createUser(request))
                .message("User created successfully")
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse>authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .data(result)
                .message(result.isValid() ? "Token is valid" : "Token is invalid")
                .build();
    }
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout successful")
                .build();
    }
    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .data(result)
                .build();

    }
    @GetMapping("/users")
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .data(authenticationService.getUsers())
                .message("Users retrieved successfully")
                .build();
    }
    @GetMapping("/me")
    ApiResponse<UserResponse> getMyAccount() {
        var context = SecurityContextHolder.getContext();
        String id = context.getAuthentication().getName();
        return ApiResponse.<UserResponse>builder()
                .data(authenticationService.myProfile(id))
                .message("My account retrieved successfully")
                .build();
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu đến " + email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}

