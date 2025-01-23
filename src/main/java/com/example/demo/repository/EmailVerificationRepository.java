package com.example.demo.repository;

import com.example.demo.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmailAndCode(String email, String code);
    Optional<EmailVerification> findTopByEmailOrderByIdDesc(String email);
    boolean existsByEmailAndVerifiedTrue(String email);
}