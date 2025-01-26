package com.example.demo.controller;

import com.example.demo.dto.DiseaseBasicResponse;
import com.example.demo.dto.DiseaseDetailResponse;
import com.example.demo.dto.HealthSearchResponse;
import com.example.demo.dto.MedicalRequest;
import com.example.demo.service.HealthSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthSearchController {
    private final HealthSearchService healthSearchService;
    private final WebClient ocrWebClient;

    @GetMapping("/search")
    public ResponseEntity<List<DiseaseBasicResponse>> searchDisease(
            @RequestParam String keyword) {
        return ResponseEntity.ok(healthSearchService.searchDiseaseBasic(keyword));
    }

    @GetMapping("/search/{contentId}")
    public ResponseEntity<DiseaseDetailResponse> getDiseaseDetail(
            @PathVariable String contentId) {
        return ResponseEntity.ok(healthSearchService.getDiseaseDetail(contentId));
    }

    @GetMapping("/search/{contentId}/openai")
    public ResponseEntity<String> getOpenAIAnalysis(@PathVariable String contentId) {
        DiseaseDetailResponse detail = healthSearchService.getDiseaseDetail(contentId);
        String combinedContent = detail.getSections().stream()
                .map(section -> stripHtml(section.getContent()))
                .collect(Collectors.joining("\n"));

        MedicalRequest request = MedicalRequest.builder()
                .page_type("질병 정보 페이지")
                .situation("환자가 질병에 대해 궁금해하는 상황")
                .original_info(combinedContent)
                .target_age(20)
                .build();
        log.info(combinedContent);

        return ResponseEntity.ok(ocrWebClient.post()
                .uri("/simplify")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block());
    }

    private String stripHtml(String html) {
        return html.replaceAll("<[^>]*>", "")
                .replaceAll("&nbsp;", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}