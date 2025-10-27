package org.example.onlinetest.repository;

import org.example.onlinetest.common.Role;
import org.example.onlinetest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository <User,String>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<User> findByCreateAtBetweenAndRoleIn(LocalDateTime startDate, LocalDateTime endDate, List<Role> roles);
}
