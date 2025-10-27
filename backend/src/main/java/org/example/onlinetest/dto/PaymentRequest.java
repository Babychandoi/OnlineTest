package org.example.onlinetest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Request DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long amount;
    private String orderInfo;
    private String orderType;
    private String language;
}
