package com.example.demo.dto;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PostRequest {
    private String title;
    private String content;
    private PostCategory category;
    private DisabilityType disabilityType;
}
