package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiseaseBasicResponse {
    private String contentId;
    private String title;
}