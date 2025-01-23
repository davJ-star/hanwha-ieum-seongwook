package com.example.demo.controller;

import com.example.demo.dto.HealthSearchResponse;
import com.example.demo.dto.SearchResultDto;
import com.example.demo.service.HealthSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthSearchController {
    private final HealthSearchService healthSearchService;

    @GetMapping("/search")
    public ResponseEntity<List<SearchResultDto>> searchDisease(
            @RequestParam(required = true) String keyword) {
        return ResponseEntity.ok(healthSearchService.searchDisease(keyword));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API 서버 동작 중");
    }
}