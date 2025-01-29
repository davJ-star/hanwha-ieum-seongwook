package com.example.demo.service;

import com.example.demo.Enum.DosageUnit;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("[한화이음] 회원가입 이메일 인증");
            helper.setText(createEmailContent(code), true); // HTML 형식 사용

            mailSender.send(message);
            log.info("Verification email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("이메일 전송에 실패했습니다.");
        }
    }

    private String createEmailContent(String code) {
        return String.format("""
            <div style='margin:100px;'>
                <h1>이메일 인증 코드</h1>
                <br>
                <p>아래의 인증 코드를 입력해주세요.</p>
                <br>
                <div style='font-size:24px; background-color:#f8f9fa; padding:20px; border-radius:4px;'>
                    <strong>%s</strong>
                </div>
                <br>
                <p>본 인증 코드는 30분간 유효합니다.</p>
            </div>
            """, code);
    }

    public void sendMedicationReminder(String to, String drugName, Double dosage, DosageUnit unit, LocalTime time) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("[한화이음] 복용약 알림");
            helper.setText(createMedicationReminderContent(drugName, dosage, unit, time), true);

            mailSender.send(message);
            log.info("Medication reminder email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send medication reminder to: {}", to, e);
            throw new RuntimeException("알림 이메일 전송에 실패했습니다.");
        }
    }

    private String createMedicationReminderContent(String drugName, Double dosage, DosageUnit unit, LocalTime time) {
        return String.format("""
            <div style='margin:100px;'>
                <h1>복용약 알림</h1>
                <br>
                <p>현재 시간이 복용 예정 시간입니다.</p>
                <br>
                <div style='font-size:18px; background-color:#f8f9fa; padding:20px; border-radius:4px;'>
                    <p><strong>약품명:</strong> %s</p>
                    <p><strong>복용량:</strong> %s%s</p>
                    <p><strong>복용 시간:</strong> %s</p>
                </div>
                <br>
                <p>건강한 하루 되세요!</p>
            </div>
            """, drugName, dosage, unit.getLabel(), time.format(DateTimeFormatter.ofPattern("HH:mm")));
    }
}