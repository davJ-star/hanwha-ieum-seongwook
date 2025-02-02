package com.example.demo.service;

import com.example.demo.Enum.Role;
import com.example.demo.component.FileUploadUtil;
import com.example.demo.config.S3Config;
import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileUploadUtil fileUploadUtil;
    private final S3Service s3Service;
    private final EmailVerificationService emailVerificationService;

    @Transactional
    public String encode(String encode){
        return bCryptPasswordEncoder.encode(encode);
    }


    @Transactional
    public Long save(SignupRequest request) {  // AddUserRequest → SignupRequest
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .name(request.getNickname())  // 새로 추가된 필드
                .profileImage(request.getProfileImage())  // 새로 추가된 필드
                .build();

        return userRepository.save(user).getId();
    }

    // 현재 로그인한 사용자 정보 조회
    public User getMyInfo(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    // 사용자 정보 수정
    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.update(request.getName());
    }

    // 비밀번호 변경
    @Transactional
    public void updatePassword(String email, PasswordUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!bCryptPasswordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new RuntimeException("새 비밀번호가 일치하지 않습니다.");
        }

        user.updatePassword(bCryptPasswordEncoder.encode(request.getNewPassword()));
    }

    // 프로필 이미지 업로드

    @Transactional
    public void updateProfileImage(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 파일 저장 및 URL 받기
        String imageUrl = s3Service.uploadFile(file);
        user.setProfileImage(imageUrl);
    }


    // 회원 탈퇴
    @Transactional
    public void deleteUser(String email, UserDeleteRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        userRepository.delete(user);
    }



}