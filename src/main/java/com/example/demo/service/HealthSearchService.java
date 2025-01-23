package com.example.demo.service;

import com.example.demo.dto.SearchResultDto;
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

    public List<SearchResultDto> searchDisease(String keyword) {
        List<HealthContent> contents = healthContentRepository.searchByTitleKeyword(keyword);

        return contents.stream().map(content -> {
            log.info("Finding sections for content_id: {}", content.getContentId());
            List<ContentSection> sections = contentSectionRepository.findByContentId(content.getContentId());
            log.info("Found {} sections", sections.size());

            return SearchResultDto.builder()
                    .contentId(content.getContentId())
                    .title(content.getTitle())
                    .sections(sections.stream()
                            .map(section -> SearchResultDto.SectionContentDto.builder()
                                    .sectionName(section.getSectionName())
                                    .content(section.getContent())
                                    .build())
                            .collect(Collectors.toList()))
                    .build();
        }).collect(Collectors.toList());
    }
}