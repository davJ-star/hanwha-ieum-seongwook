package com.example.demo.service;

import com.example.demo.dto.DiseaseBasicResponse;
import com.example.demo.dto.DiseaseDetailResponse;
import com.example.demo.entity.ContentSection;
import com.example.demo.entity.HealthContent;
import com.example.demo.repository.ContentSectionRepository;
import com.example.demo.repository.HealthContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class HealthSearchService {
    private final HealthContentRepository healthContentRepository;
    private final ContentSectionRepository contentSectionRepository;

    public List<DiseaseBasicResponse> searchDiseaseBasic(String keyword) {
        List<HealthContent> contents = healthContentRepository.searchByTitleKeyword(keyword);
        return contents.stream()
                .map(content -> DiseaseBasicResponse.builder()
                        .contentId(content.getContentId())
                        .title(content.getTitle())
                        .build())
                .collect(Collectors.toList());
    }

    public DiseaseDetailResponse getDiseaseDetail(String contentId) {
        HealthContent content = healthContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        List<ContentSection> sections = contentSectionRepository.findByContentId(contentId);

        return DiseaseDetailResponse.builder()
                .contentId(content.getContentId())
                .title(content.getTitle())
                .sections(sections.stream()
                        .map(section -> DiseaseDetailResponse.SectionContentDto.builder()
                                .sectionName(section.getSectionName())
                                .content(section.getContent())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}