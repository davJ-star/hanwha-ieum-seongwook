package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

// DrugSearchRequest.java 수정
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DrugSearchRequest {
    private String query;
}