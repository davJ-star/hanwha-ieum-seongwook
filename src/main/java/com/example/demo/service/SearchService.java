package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.Search;
import com.example.demo.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {
    private final SearchRepository searchRepository;
    private final WebClient webClient;
    private final WebClient fastApiClient;  // fastApiClient 주입
    private static final String Servicekey ="9KgayeN99Pk565kBiypcuaQFWsyAXstKMjcQU1nv1yglIuSy9J2gwKnMqxwSzNsmKp1UO1jOCG9uF9%2Br7iuXtw%3D%3D";

    public DrugResponse drugSearch(String search){
        String url = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=" + Servicekey + "&itemName=" + URLEncoder.encode(search) +"&type=json";

        return webClient
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(DrugResponse.class)
                .block();
    }

    public List<DrugBasicResponse> searchAndSave(String keyword) {
        DrugResponse response = drugSearch(keyword);
        if (response.getBody() == null || response.getBody().getItems() == null) {
            // FastAPI로 대체 검색 요청
            try {
                DrugSearchRequest request = new DrugSearchRequest(keyword);
                String alternativeInfo = fastApiClient.post()
                        .uri("/search/drug/basic")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                // alternativeInfo를 포함한 DrugBasicResponse 생성
                DrugBasicResponse alternativeResponse = DrugBasicResponse.builder()
                        .id(-1L)  // 특별한 ID로 대체 정보임을 표시
                        .itemName(keyword)
                        .entpName("검색 결과 없음")
                        .efcyQesitm(alternativeInfo)
                        .build();

                return Collections.singletonList(alternativeResponse);
            } catch (Exception e) {
                // FastAPI 호출 실패시 빈 리스트 반환
                log.error("FastAPI 검색 실패: ", e);
                return new ArrayList<>();
            }
        }

        return response.getBody().getItems().stream()
                .map(item -> {
                    Search search;
                    if (!searchRepository.existsByItemName(item.getItemName())) {
                        search = Search.builder()
                                .entpName(item.getEntpName())
                                .itemName(item.getItemName())
                                .efcyQesitm(item.getEfcyQesitm())
                                .build();
                        search = searchRepository.save(search);
                    } else {
                        search = searchRepository.findByItemName(item.getItemName());
                    }

                    return new DrugBasicResponse(
                            search.getId(),
                            item.getEntpName(),
                            item.getItemName(),
                            item.getEfcyQesitm()
                    );
                })
                .collect(Collectors.toList());
    }

    public DrugDetailResponse getDrugDetail(Long id) {
        DrugResponse response = drugSearch(searchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found"))
                .getItemName());
        SearchDto item = response.getBody().getItems().get(0);

        return new DrugDetailResponse(
                item.getItemName(),
                item.getEfcyQesitm(),
                item.getAtpnWarnQesitm(),
                item.getAtpnQesitm(),
                item.getIntrcQesitm(),
                item.getSeQesitm(),
                item.getDepositMethodQesitm()
        );
    }
}