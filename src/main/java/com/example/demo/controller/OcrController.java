package com.example.demo.controller;

import com.example.demo.dto.DrugBasicResponse;
import com.example.demo.dto.DrugDetailResponse;
import com.example.demo.dto.OcrResponse;
import com.example.demo.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class OcrController {

    private final WebClient ocrWebClient;
    private final SearchService searchService;


    @PostMapping("/ocr")
    public List<DrugBasicResponse> processImage(@RequestPart("file") MultipartFile file) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", file.getResource());

        // OCR API 호출
        String ocrText = ocrWebClient.post()
                .uri("http://localhost:8001/ocr")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(OcrResponse.class)
                .map(OcrResponse::getText)
                .block();

        // OCR 결과를 단어로 분리
        String[] words = ocrText.split(" ");

        // 각 단어로 의약품 검색
        List<DrugBasicResponse> results = new ArrayList<>();
        for (String word : words) {
            List<DrugBasicResponse> searchResult = searchService.searchAndSave(word);
            results.addAll(searchResult);
        }

        return results;
    }

    @GetMapping("/ocr/{id}/detail")
    public DrugDetailResponse getOcrDrugDetail(@PathVariable Long id) {
        return searchService.getDrugDetail(id);
    }
}
