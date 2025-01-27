package com.example.demo.dto;

import com.example.demo.entity.Medication;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MedicationResponse {
    private Long id;
    private String drugName;
    private Double dosage;
    private String unit;
    private LocalDateTime addedAt;

    public static MedicationResponse from(Medication medication) {
        MedicationResponse response = new MedicationResponse();
        response.setId(medication.getId());
        response.setDrugName(medication.getDrugName());
        response.setDosage(medication.getDosage());
        response.setUnit(medication.getUnit().getLabel());
        response.setAddedAt(medication.getAddedAt());
        return response;
    }
}