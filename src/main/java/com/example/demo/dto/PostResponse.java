package com.example.demo.dto;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private PostCategory category;
    private DisabilityType disabilityType;
    private LocalDateTime createdAt;
    private List<CommentResponse> comments;
}