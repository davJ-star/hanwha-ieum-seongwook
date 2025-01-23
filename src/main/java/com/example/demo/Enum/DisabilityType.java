package com.example.demo.Enum;

import lombok.Getter;

@Getter
public enum DisabilityType {
    PHYSICAL("지체장애"),
    BRAIN("뇌병변장애"),
    VISUAL("시각장애"),
    AUDITORY("청각장애"),
    LANGUAGE("언어장애"),
    DEVELOPMENTAL("안면장애"),
    INTERNAL_ORGANS("내부기관 장애"),
    INTELLECTUAL("정신적 장애");

    private final String value;

    DisabilityType(String value) {
        this.value = value;
    }
}