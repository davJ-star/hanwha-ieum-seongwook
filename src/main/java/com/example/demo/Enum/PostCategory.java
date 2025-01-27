package com.example.demo.Enum;

import lombok.Getter;

@Getter
public enum PostCategory {
    QUESTION("질문"),
    INFORMATION("자유"),
    NOTICE("공지");


    private final String value;

    PostCategory(String value) {
        this.value = value;
    }
}
