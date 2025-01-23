package com.example.demo.service;

import com.example.demo.entity.EmailVerification;
import com.example.demo.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailVerificationService {
    private final EmailVerificationRepository verificationRepository;
    private final EmailService emailService;
    private final Random random = new Random();

    @Transactional
    public void sendVerificationEmail(String email) {
        // 이전 인증 코드가 있다면 만료
        verificationRepository.findTopByEmailOrderByIdDesc(email)
                .ifPresent(verification -> {
                    if (!verification.isExpired() && !verification.isVerified()) {
                        throw new RuntimeException("이미 발송된 인증 메일이 있습니다. 잠시 후 다시 시도해주세요.");
                    }
                });

        // 새 인증 코드 생성 및 저장
        String code = generateVerificationCode();
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();

        verificationRepository.save(verification);
        emailService.sendVerificationEmail(email, code);
    }

    @Transactional
    public boolean verifyEmail(String email, String code) {
        EmailVerification verification = verificationRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 인증 코드입니다."));

        if (verification.isExpired()) {
            throw new RuntimeException("만료된 인증 코드입니다.");
        }

        if (verification.isVerified()) {
            throw new RuntimeException("이미 사용된 인증 코드입니다.");
        }

        verification.verify();
        return true;
    }

    public boolean isEmailVerified(String email) {
        return verificationRepository.existsByEmailAndVerifiedTrue(email);
    }

    private String generateVerificationCode() {
        return String.format("%06d", random.nextInt(1000000));
    }
}