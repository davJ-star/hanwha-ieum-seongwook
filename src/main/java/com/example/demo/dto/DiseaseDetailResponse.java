package com.example.demo.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseDetailResponse {
    private String contentId;
    private String title;
    private List<SectionContentDto> sections;

    @Getter @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionContentDto {
        private String sectionName;
        private String content;
    }
}