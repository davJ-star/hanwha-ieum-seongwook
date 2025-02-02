package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DrugBasicResponse {
    private Long id;
    private String entpName;
    private String itemName;
    private String efcyQesitm;
}