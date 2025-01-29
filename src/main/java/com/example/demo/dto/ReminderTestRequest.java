package com.example.demo.dto;

import com.example.demo.Enum.DosageUnit;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReminderTestRequest {
    private String email;
    private String drugName;
    private Double dosage;
    private DosageUnit unit;
    private int hour;
    private int minute;
}