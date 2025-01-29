package com.example.demo.Enum;

public enum DayOfWeek {
    MONDAY("월요일"),
    TUESDAY("화요일"),
    WEDNESDAY("수요일"),
    THURSDAY("목요일"),
    FRIDAY("금요일"),
    SATURDAY("토요일"),
    SUNDAY("일요일");

    private final String korName;

    DayOfWeek(String korName) {
        this.korName = korName;
    }

    public String getKorName() {
        return korName;
    }
}