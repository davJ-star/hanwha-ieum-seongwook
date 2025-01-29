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
        private String profileImage;
        private String nickname;  // name 대신 nickname으로 변경
    }

    @Getter
    @Setter
    public static class MedicationData {
        private String drugName;
        private Float dosage;    // Double에서 Float으로 변경
        private String unit;
        private String frequency;  // 새로 추가 (daily or weekly)
        private TimeData time;    // 새로 추가
        private String weekday;   // 새로 추가 (optional)
    }

    @Getter
    @Setter
    public static class TimeData {
        private String hour;
        private String minute;
    }
}