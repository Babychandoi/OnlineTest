package org.example.onlinetest.repository.specification;

import jakarta.persistence.criteria.Expression;
import org.example.onlinetest.entity.Competition;
import org.springframework.data.jpa.domain.Specification;

import java.sql.Time;
import java.util.Date;

public class CompetitionSpecification {
    public static Specification<Competition> hasKeyword(String keyword) {
        return (root, query, builder) -> {
            if (keyword == null || keyword.isEmpty()) {
                return builder.conjunction();
            }
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return builder.like(builder.lower(root.get("name")), likePattern);
        };
    }
    public static Specification<Competition> hasStatus(String status) {
        return (root, query, builder) -> {
            if (status == null || status.isEmpty()) {
                return builder.conjunction(); // không lọc
            }

            // Lấy thời gian hiện tại
            Date now = new Date();

            // Tính toán thời điểm kết thúc = startDate + durationMinutes
            Expression<Date> endDateTime = builder.function(
                    "ADDTIME", Date.class,
                    root.get("startDate"),
                    builder.function("SEC_TO_TIME", Time.class, builder.prod(root.get("durationMinutes"), 60))
            );

            // Lọc theo trạng thái
            return switch (status) {
                case "UPCOMING" ->
                    // startDate > now
                        builder.greaterThan(root.get("startDate"), now);
                case "ONGOING" ->
                    // startDate <= now <= endDateTime
                        builder.and(
                                builder.lessThanOrEqualTo(root.get("startDate"), now),
                                builder.greaterThan(endDateTime, now)
                        );
                case "PAST" ->
                    // endDateTime < now
                        builder.lessThan(endDateTime, now);
                default -> builder.conjunction();
            };
        };
    }

    public static Specification<Competition> hasType(Boolean type) {
        return (root, query, builder) -> {
            if (type == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("type"), type);
        };
    }

}
