package com.example.demo.controller;

import com.example.demo.dto.DrugBasicResponse;
import com.example.demo.dto.DrugDetailResponse;
import com.example.demo.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/search")
@Slf4j
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/{keyword}")
    public List<DrugBasicResponse> search(@PathVariable(value = "keyword") String search){
        return searchService.searchAndSave(search);
    }

    @GetMapping("/{id}/info")
    public DrugDetailResponse getDrugDetail(@PathVariable(value = "id") Long id){
        return searchService.getDrugDetail(id);
    }


}
