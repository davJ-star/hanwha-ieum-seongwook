package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String email;
    private String password;
    private String verificationCode;  // optional
    private String nickname;
    private String profileImage;      // optional
    private String passwordConfirm;
}