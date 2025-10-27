package org.example.onlinetest.repository.specification;

import org.example.onlinetest.common.Role;
import org.example.onlinetest.entity.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class UserSpecification {
    public static Specification<User> hasEmail(String email) {
        return (root, query, builder) -> {
            if (email == null || email.isEmpty()) {
                return builder.conjunction();
            }
            String likePattern = "%" + email.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("email")), likePattern));
        };
    }
    public static Specification<User> hasFullName(String fullName) {
        return (root, query, builder) -> {
            if (fullName == null || fullName.isEmpty()) {
                return builder.conjunction();
            }
            String likePattern = "%" + fullName.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("fullName")), likePattern));
        };
    }
    public static Specification<User> hasPhone(String phone) {
        return (root, query, builder) -> {
            if (phone == null || phone.isEmpty()) {
                return builder.conjunction();
            }
            String likePattern = "%" + phone.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("phone")), likePattern));
        };
    }
    public static Specification<User> hasRole(String role) {
        return (root, query, builder) -> {
            if (role == null) {
                return builder.conjunction();
            }
            return builder.or(
                    builder.like(builder.lower(root.get("role")), role.toLowerCase()));
        };
    }
    public static Specification<User> hasIsPremium(Boolean isPremium) {
        return (root, query, builder) -> {
            if (isPremium == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("isPremium"), isPremium);
        };
    }
    public static Specification<User> hasRoleIn(List<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return null;
        }
        return (root, query, cb) -> root.get("role").in(roles);
    }
}

