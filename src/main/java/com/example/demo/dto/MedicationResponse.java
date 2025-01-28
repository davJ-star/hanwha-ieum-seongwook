package com.example.demo.dto;

import com.example.demo.entity.Medication;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MedicationResponse {
    private String drugName;
    private Double dosage;
    private String unit;

    public static MedicationResponse from(Medication medication) {
        MedicationResponse response = new MedicationResponse();
        response.setDrugName(medication.getDrugName());
        response.setDosage(medication.getDosage());
        response.setUnit(medication.getUnit().getLabel());
        return response;
    }
}