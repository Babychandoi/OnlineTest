package org.example.onlinetest.security;


import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.example.onlinetest.common.Role;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner init(UserRepository userRepository) {
        return args -> {
            if(userRepository.findByEmail("onlinetest@gmail.com").isEmpty()) {
                User user = User.builder()
                        .email("onlinetest@gmail.com")
                        .role(Role.ADMIN)
                        .fullName("Admin")
                        .phone("0123456789")
                        .password(passwordEncoder.encode("12345678"))
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: oanoanjiji");
            }};
    }
}

