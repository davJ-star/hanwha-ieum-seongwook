package com.example.demo.service;

import com.example.demo.dto.DiseaseBasicResponse;
import com.example.demo.dto.DiseaseDetailResponse;
import com.example.demo.dto.DiseaseSearchRequest;
import com.example.demo.entity.ContentSection;
import com.example.demo.entity.HealthContent;
import com.example.demo.repository.ContentSectionRepository;
import com.example.demo.repository.HealthContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class HealthSearchService {
    private final HealthContentRepository healthContentRepository;
    private final ContentSectionRepository contentSectionRepository;

    private final WebClient fastApiClient;  // FastAPI 클라이언트 주입

    public List<DiseaseBasicResponse> searchDiseaseBasic(String keyword) {
        List<HealthContent> contents = healthContentRepository.searchByTitleKeyword(keyword);

        // 검색 결과가 없는 경우 FastAPI로 대체 검색
        if (contents.isEmpty()) {
            try {
                DiseaseSearchRequest request = new DiseaseSearchRequest(keyword);
                String alternativeInfo = fastApiClient.post()
                        .uri("/search/disease/basic")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                // alternativeInfo를 포함한 DiseaseBasicResponse 생성
                DiseaseBasicResponse alternativeResponse = DiseaseBasicResponse.builder()
                        .contentId("not_found")  // 특별한 ID로 대체 정보임을 표시
                        .title(keyword)
                        .description(alternativeInfo)  // 필요한 경우 DiseaseBasicResponse에 description 필드 추가
                        .build();

                return Collections.singletonList(alternativeResponse);
            } catch (Exception e) {
                log.error("FastAPI 검색 실패: ", e);
                return Collections.emptyList();
            }
        }

        // 기존 검색 로직
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