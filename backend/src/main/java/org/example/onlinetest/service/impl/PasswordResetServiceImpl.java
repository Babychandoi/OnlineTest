package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.repository.UserRepository;
import org.example.onlinetest.service.EmailService;
import org.example.onlinetest.service.PasswordResetService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class PasswordResetServiceImpl implements PasswordResetService {

    RedisTemplate<String, String> redisTemplate; // sửa lại cho khớp với RedisConfig
    UserRepository userRepository;
    EmailService emailService;

    private static final String PREFIX = "reset_token:"; // key Redis prefix
    private static final long EXPIRATION_MINUTES = 15;   // TTL 15 phút

    @Override
    public void createPasswordResetToken(String email) {
        log.info("Yêu cầu đặt lại mật khẩu cho email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống."));

        // Tạo token ngẫu nhiên
        String token = UUID.randomUUID().toString();

        // Lưu token vào Redis (key = reset_token:<token>, value = email)
        redisTemplate.opsForValue().set(PREFIX + token, email, EXPIRATION_MINUTES, TimeUnit.MINUTES);

        log.info("Đã lưu token {} vào Redis với TTL {} phút", token, EXPIRATION_MINUTES);

        // Gửi email chứa link reset
        emailService.sendPasswordResetEmail(email, token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        log.info("Xác thực token reset password: {}", token);

        String key = PREFIX + token;
        String email = redisTemplate.opsForValue().get(key);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng tương ứng."));

        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi sử dụng
        redisTemplate.delete(key);
        log.info("Đã đặt lại mật khẩu thành công cho email: {}", email);
    }
}
