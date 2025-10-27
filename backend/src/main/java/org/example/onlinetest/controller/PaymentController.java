package org.example.onlinetest.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.PaymentRequest;
import org.example.onlinetest.dto.PaymentResponse;
import org.example.onlinetest.dto.TransactionStatusDTO;
import org.example.onlinetest.service.VNPayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final VNPayService vnPayService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody PaymentRequest request,
            HttpServletRequest httpRequest) {

        try {
            log.info("Creating payment for amount: {} VND", request.getAmount());

            // Validate input
            if (request.getAmount() == null || request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(
                        PaymentResponse.builder()
                                .code("01")
                                .message("Số tiền không hợp lệ")
                                .build()
                );
            }

            String ipAddress = getClientIp(httpRequest);
            String paymentUrl = vnPayService.createPaymentUrl(request, ipAddress);

            return ResponseEntity.ok(
                    PaymentResponse.builder()
                            .code("00")
                            .message("Tạo URL thanh toán thành công")
                            .paymentUrl(paymentUrl)
                            .build()
            );

        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    PaymentResponse.builder()
                            .code("99")
                            .message("Lỗi hệ thống: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<TransactionStatusDTO> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            log.info("Processing VNPay callback for transaction: {}", params.get("vnp_TxnRef"));
            TransactionStatusDTO status = vnPayService.processCallback(params);

            // TODO: Save transaction to database here
            // transactionService.saveTransaction(status);

            return ResponseEntity.ok(status);

        } catch (Exception e) {
            log.error("Error processing VNPay callback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    TransactionStatusDTO.builder()
                            .code("99")
                            .message("Lỗi xử lý callback: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> params) {
        try {
            log.info("Processing VNPay IPN for transaction: {}", params.get("vnp_TxnRef"));
            TransactionStatusDTO status = vnPayService.processCallback(params);

            // TODO: Update transaction status in database
            // transactionService.updateTransactionStatus(status);

            if ("00".equals(status.getCode())) {
                return ResponseEntity.ok(Map.of(
                        "RspCode", "00",
                        "Message", "Confirm Success"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "RspCode", "97",
                        "Message", "Invalid Signature"
                ));
            }

        } catch (Exception e) {
            log.error("Error processing VNPay IPN", e);
            return ResponseEntity.ok(Map.of(
                    "RspCode", "99",
                    "Message", "System Error"
            ));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("X-Real-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress;
    }
}
