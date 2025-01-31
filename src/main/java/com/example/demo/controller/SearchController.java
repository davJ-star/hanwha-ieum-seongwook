package com.example.demo.controller;

import com.example.demo.dto.DetailedMedicalRequest;
import com.example.demo.dto.DiseaseDetailResponse;
import com.example.demo.dto.DrugBasicResponse;
import com.example.demo.dto.DrugDetailResponse;
import com.example.demo.service.HealthSearchService;
import com.example.demo.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/search")
@Slf4j
public class SearchController {
    private final SearchService searchService;
    private final HealthSearchService healthSearchService;

    @Qualifier("fastApiClient")
    private final WebClient fastApiClient;

    @GetMapping("/{keyword}")
    public List<DrugBasicResponse> search(@PathVariable(value = "keyword") String search){
        return searchService.searchAndSave(search);
    }


    @GetMapping("/{id}/info")
    public DrugDetailResponse getDrugDetail(@PathVariable(value = "id") Long id){
        return searchService.getDrugDetail(id);
    }

    @GetMapping("/{id}/info/openai")
    public ResponseEntity<String> getDrugOpenAIAnalysis(@PathVariable Long id) {
        DrugDetailResponse detail = searchService.getDrugDetail(id);

        StringBuilder combinedContent = new StringBuilder();
        combinedContent
                .append("💊 약품명\n")
                .append(stripHtml(detail.getItemName()))
                .append("\n\n")

                .append("✨ 효능효과\n")
                .append(stripHtml(detail.getEfcyQesitm()))
                .append("\n\n")

                .append("⚠️ 경고 및 주의사항\n")
                .append(stripHtml(detail.getAtpnWarnQesitm()))
                .append("\n\n")

                .append("📋 복용 시 주의사항\n")
                .append(stripHtml(detail.getAtpnQesitm()))
                .append("\n\n")

                .append("💡 다른 약과의 상호작용\n")
                .append(stripHtml(detail.getIntrcQesitm()))
                .append("\n\n")

                .append("⚕️ 발생 가능한 부작용\n")
                .append(stripHtml(detail.getSeQesitm()))
                .append("\n\n")

                .append("📦 보관 방법\n")
                .append(stripHtml(detail.getDepositMethodQesitm()));

        DetailedMedicalRequest request = DetailedMedicalRequest.builder()
                .category("약품")
                .page_type("약품 정보 페이지")
                .situation("환자가 약품에 대해 궁금해하는 상황")
                .original_info(combinedContent.toString())
                .target_age(7)
                .build();

        return ResponseEntity.ok(fastApiClient.post()
                .uri("/simplify/detailed")
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
