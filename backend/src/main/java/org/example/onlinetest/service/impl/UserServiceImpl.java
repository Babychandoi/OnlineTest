package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.admin.response.UserResponse;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.repository.UserRepository;
import org.example.onlinetest.service.UserService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    @Override
    public Boolean updateUser(UserResponse userResponse) {
        try{
            System.out.println(userResponse);
            User user = userRepository.findById(userResponse.getId()).orElseThrow();
            user.setFullName(userResponse.getFullName());
            user.setPhone(userResponse.getPhone());
            userRepository.save(user);
            return true;
        }catch (Exception e){
            log.error("Error in updating user: {}", e.getMessage());
            return false;
        }
    }
}
