package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
}