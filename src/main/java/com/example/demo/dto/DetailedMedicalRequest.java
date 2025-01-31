package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailedMedicalRequest {
    private String category;
    private String page_type;
    private String situation;
    private String original_info;
    private int target_age;
}