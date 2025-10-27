package org.example.onlinetest.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Đặt lại mật khẩu - Hệ thống Online Test";
        String resetLink = "https://onlinetest1.unaux.com/reset-password?token=" + token;

        String content = """
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #0d6efd; padding: 20px 30px; color: #fff;">
                    <h2 style="margin: 0; font-weight: 600;">Online Test System</h2>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Xin chào,</p>
                    <p style="font-size: 15px; color: #444;">
                        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                        Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" 
                           style="background-color: #0d6efd; color: #fff; text-decoration: none; padding: 12px 24px; 
                                  border-radius: 6px; font-size: 16px; font-weight: 500; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        Liên kết này sẽ hết hạn sau <strong>15 phút</strong> vì lý do bảo mật.<br>
                        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    <p style="font-size: 13px; color: #999; text-align: center;">
                        © 2025 Online Test System. Mọi quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </div>
        """.formatted(resetLink);
        sendHtmlEmail(toEmail, subject, content);
    }
    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = gửi email dạng HTML
            mailSender.send(message);
            System.out.println("✅ Email gửi thành công đến: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Lỗi khi gửi email: " + e.getMessage());
            throw new RuntimeException("Không thể gửi email");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
