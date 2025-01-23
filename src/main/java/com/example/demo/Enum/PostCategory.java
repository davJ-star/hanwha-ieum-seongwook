package com.example.demo.Enum;

import lombok.Getter;

@Getter
public enum PostCategory {
    QUESTION("질문"),
    INFORMATION("정보");

    private final String value;

    PostCategory(String value) {
        this.value = value;
    }
}
