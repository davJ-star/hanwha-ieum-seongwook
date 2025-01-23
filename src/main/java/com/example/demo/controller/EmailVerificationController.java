package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.EmailVerificationRequest;
import com.example.demo.dto.EmailVerifyRequest;
import com.example.demo.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailVerificationController {
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/send-verification")
    public ResponseEntity<ApiResponse> sendVerification(@RequestBody EmailVerificationRequest request) {
        try {
            emailVerificationService.sendVerificationEmail(request.getEmail());
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("인증 메일이 발송되었습니다.")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestBody EmailVerifyRequest request) {
        try {
            boolean verified = emailVerificationService.verifyEmail(request.getEmail(), request.getCode());
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(verified)
                    .message("이메일이 성공적으로 인증되었습니다.")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }
}