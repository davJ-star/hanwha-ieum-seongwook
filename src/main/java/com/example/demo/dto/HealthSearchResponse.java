package com.example.demo.dto;

import com.example.demo.entity.HealthContent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;
// DTO


@Getter @Setter
@NoArgsConstructor
public class HealthSearchResponse {
    private String title;
    private List<ContentSectionDto> sections;
}