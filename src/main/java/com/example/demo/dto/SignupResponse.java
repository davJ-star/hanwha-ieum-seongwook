package com.example.demo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
public class SignupResponse {
    private boolean success;
    private String message;
    private Map<String, Object> data;
}