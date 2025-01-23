package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String code;  // 6자리 인증 코드

    @Column(nullable = false)
    private boolean verified;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Builder
    public EmailVerification(String email, String code, LocalDateTime expiryDate) {
        this.email = email;
        this.code = code;
        this.expiryDate = expiryDate;
        this.verified = false;
    }

    public void verify() {
        this.verified = true;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
