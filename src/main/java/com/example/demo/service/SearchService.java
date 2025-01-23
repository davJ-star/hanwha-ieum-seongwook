package com.example.demo.service;

import com.example.demo.dto.DrugBasicResponse;
import com.example.demo.dto.DrugDetailResponse;
import com.example.demo.dto.DrugResponse;
import com.example.demo.dto.SearchDto;
import com.example.demo.entity.Search;
import com.example.demo.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.net.URLEncoder;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final SearchRepository searchRepository;
    private final WebClient webClient;
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
        return response.getBody().getItems().stream()
                .map(item -> {
                    if (!searchRepository.existsByItemName(item.getItemName())) {
                        Search search = Search.builder()
                                .entpName(item.getEntpName())
                                .itemName(item.getItemName())
                                .efcyQesitm(item.getEfcyQesitm())
                                .build();
                        searchRepository.save(search);
                    }
                    return new DrugBasicResponse(
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
                item.getAtpnWarnQesitm(),
                item.getAtpnQesitm(),
                item.getIntrcQesitm(),
                item.getSeQesitm(),
                item.getDepositMethodQesitm()
        );
    }
}
