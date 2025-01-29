package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountResponse {
    private AccountData account;

    @Getter
    @Setter
    public static class AccountData {
        private String path;
        private FieldsData fields;
    }

    @Getter
    @Setter
    public static class FieldsData {
        private UserData user;
        private PasswordChangeData passwordChange;
    }

    @Getter
    @Setter
    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String emailVerificationCode;
    }

    @Getter
    @Setter
    public static class PasswordChangeData {
        private String currentPassword;
        private String newPassword;
        private String newPasswordConfirm;
    }
}