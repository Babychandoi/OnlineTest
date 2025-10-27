package org.example.onlinetest.service;


import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.PaymentRequest;
import org.example.onlinetest.dto.TransactionStatusDTO;
import org.example.onlinetest.entity.Payment;
import org.example.onlinetest.vnpay.VNPayConfig;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    public String createPaymentUrl(PaymentRequest request, String ipAddress) {
        Map<String, String> vnpParams = new TreeMap<>();

        String vnpTxnRef = generateTxnRef();
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";

        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", request.getOrderInfo());
        vnpParams.put("vnp_OrderType", request.getOrderType() != null ? request.getOrderType() : "other");
        vnpParams.put("vnp_Locale", request.getLanguage() != null ? request.getLanguage() : "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", ipAddress);

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(calendar.getTime()));

        calendar.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(calendar.getTime()));

        String queryUrl = buildQueryUrl(vnpParams);
        String hashData = buildHashData(vnpParams);
        String vnpSecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        log.info("Created payment URL for transaction: {}", vnpTxnRef);
        return vnPayConfig.getApiUrl() + "?" + queryUrl;
    }

    public TransactionStatusDTO processCallback(Map<String, String> params) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        String calculatedHash = vnPayConfig.hmacSHA512(
                vnPayConfig.getHashSecret(),
                buildHashData(new TreeMap<>(params))
        );

        if (!calculatedHash.equals(vnpSecureHash)) {
            log.error("Invalid signature for transaction: {}", params.get("vnp_TxnRef"));
            return TransactionStatusDTO.builder()
                    .code("97")
                    .message("Chữ ký không hợp lệ")
                    .build();
        }

        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            log.info("Payment successful for transaction: {}", params.get("vnp_TxnRef"));

            return TransactionStatusDTO.builder()
                    .code("00")
                    .message("Giao dịch thành công")
                    .transactionId(params.get("vnp_TransactionNo"))
                    .amount(Long.parseLong(params.get("vnp_Amount")) / 100)
                    .orderInfo(params.get("vnp_OrderInfo"))
                    .bankCode(params.get("vnp_BankCode"))
                    .payDate(params.get("vnp_PayDate"))
                    .build();
        } else {
            log.warn("Payment failed for transaction: {}. Response code: {}",
                    params.get("vnp_TxnRef"), responseCode);

            return TransactionStatusDTO.builder()
                    .code(responseCode)
                    .message(getResponseMessage(responseCode))
                    .transactionId(params.get("vnp_TxnRef"))
                    .build();
        }
    }

    private String generateTxnRef() {
        return String.valueOf(System.currentTimeMillis());
    }

    private String buildQueryUrl(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        params.forEach((key, value) -> {
            try {
                if (value != null && !value.isEmpty()) {
                    if (query.length() > 0) {
                        query.append('&');
                    }
                    query.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()))
                            .append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                }
            } catch (UnsupportedEncodingException e) {
                log.error("Error encoding parameter: {}", key, e);
            }
        });
        return query.toString();
    }

    private String buildHashData(Map<String, String> params) {
        StringBuilder hashData = new StringBuilder();
        params.forEach((key, value) -> {
            try {
                if (value != null && !value.isEmpty()) {
                    if (hashData.length() > 0) {
                        hashData.append('&');
                    }
                    hashData.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()))
                            .append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                }
            } catch (UnsupportedEncodingException e) {
                log.error("Error encoding hash data: {}", key, e);
            }
        });
        return hashData.toString();
    }

    private String getResponseMessage(String responseCode) {
        Map<String, String> responseMessages = new HashMap<>();
        responseMessages.put("00", "Giao dịch thành công");
        responseMessages.put("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).");
        responseMessages.put("09", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.");
        responseMessages.put("10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần");
        responseMessages.put("11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.");
        responseMessages.put("12", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.");
        responseMessages.put("13", "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.");
        responseMessages.put("24", "Giao dịch không thành công do: Khách hàng hủy giao dịch");
        responseMessages.put("51", "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.");
        responseMessages.put("65", "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.");
        responseMessages.put("75", "Ngân hàng thanh toán đang bảo trì.");
        responseMessages.put("79", "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch");
        responseMessages.put("99", "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)");

        return responseMessages.getOrDefault(responseCode, "Giao dịch thất bại");
    }
}