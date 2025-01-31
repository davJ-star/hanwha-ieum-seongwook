package com.example.demo.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseBasicResponse {
    private String contentId;
    private String title;
    private String description;  // FastAPI 응답을 저장하기 위한 필드 추가
}