package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MyPageResponse {
    private MypageData mypage;

    @Getter
    @Setter
    public static class MypageData {
        private String path;
        private FieldsData fields;
    }

    @Getter
    @Setter
    public static class FieldsData {
        private UserData user;
        private List<MedicationData> medications;
    }

    @Getter
    @Setter
    public static class UserData {
        private Long id;
        private String email;
        private String name;
        private String profileImage;
    }

    @Getter
    @Setter
    public static class MedicationData {
        private String drugName;
        private Double dosage;
        private String unit;
    }
}