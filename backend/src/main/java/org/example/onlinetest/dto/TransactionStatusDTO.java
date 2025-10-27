package org.example.onlinetest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusDTO {
    private String code;
    private String message;
    private String transactionId;
    private Long amount;
    private String orderInfo;
    private String bankCode;
    private String payDate;
}
