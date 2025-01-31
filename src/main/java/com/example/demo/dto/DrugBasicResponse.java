package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class DrugBasicResponse {
    private Long id;
    private String entpName;
    private String itemName;
    private String efcyQesitm;
}
