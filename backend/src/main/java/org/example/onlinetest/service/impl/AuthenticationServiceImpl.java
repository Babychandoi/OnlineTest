package org.example.onlinetest.service.impl;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.common.ErrorCode;
import org.example.onlinetest.dto.AppException;
import org.example.onlinetest.dto.admin.request.*;
import org.example.onlinetest.dto.admin.response.AuthenticationResponse;
import org.example.onlinetest.dto.admin.response.IntrospectResponse;
import org.example.onlinetest.dto.admin.response.UserResponse;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.mapper.UserMapper;
import org.example.onlinetest.repository.UserRepository;
import org.example.onlinetest.service.AuthenticationService;
import org.example.onlinetest.service.TokenService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.List;
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    UserMapper userMapper;
    TokenService tokenService;
    public AuthenticationResponse authenticate(AuthenticationRequest request){
        try {
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            if (!new BCryptPasswordEncoder().matches(request.getPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
            }
            String accessToken = tokenService.generateAccessToken(user);
            String refreshToken = tokenService.generateRefreshToken(user);
            tokenService.saveRefreshToken(user.getId(), refreshToken, 30 * 24 * 60 * 60); // 30 ngày
            return AuthenticationResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
        }catch (Exception e) {
            log.error("Error when authenticate user", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

    }

    @Override
    @Transactional
    public Boolean createUser(UserRequest request) {
        try {
            // Kiểm tra username đã tồn tại chưa
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            // Mã hóa mật khẩu
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

            // Chuyển từ DTO sang Entity
            User user = userMapper.toUser(request);
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            userRepository.save(user);
            userRepository.flush();
            return true;

        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);

        }
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = true;
        try {
            tokenService.verifyToken(request.getToken(), false);
        } catch (Exception e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(request.getToken());
        String userId = signedJWT.getJWTClaimsSet().getSubject();

        // Thu hồi access token
        tokenService.revokeAccessToken(request.getToken());

        // Xóa refresh token trong Redis
        tokenService.deleteRefreshToken(userId);
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        String refreshToken = request.getRefreshToken();
        SignedJWT signedJWT = tokenService.verifyToken(refreshToken, true);

        // Kiểm tra type
        String type = (String) signedJWT.getJWTClaimsSet().getClaim("type");
        if (!"refresh".equals(type)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String userId = signedJWT.getJWTClaimsSet().getSubject();
        String stored = tokenService.getRefreshToken(userId);

        if (stored == null || !stored.equals(refreshToken)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Thu hồi refresh token cũ
        tokenService.revokeAccessToken(refreshToken);

        // Tạo token mới
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String newAccessToken = tokenService.generateAccessToken(user);
        String newRefreshToken = tokenService.generateRefreshToken(user);

        tokenService.saveRefreshToken(
                userId,
                newRefreshToken,
                30 * 24 * 60 * 60
        );

        return AuthenticationResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .authenticated(true)
                .build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        try {
            List<User> user = userRepository.findAll();
            return user
                    .stream()
                    .map(userMapper::toResponse).toList();
        }catch (Exception e) {
            log.error("Error when get users", e);
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    @Override
    public UserResponse myProfile(String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            return userMapper.toResponse(user);
        } catch (Exception e) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }
}
