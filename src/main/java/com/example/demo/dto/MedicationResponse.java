package com.example.demo.dto;

import com.example.demo.Enum.MedicationCycle;
import com.example.demo.entity.Medication;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MedicationResponse {
    private String drugName;
    private Float dosage;    // Double에서 Float로 변경
    private String unit;
    private String frequency;  // 추가
    private TimeData time;    // 추가
    private String weekday;   // 추가

    @Getter
    @Setter
    @NoArgsConstructor
    public static class TimeData {
        private String hour;
        private String minute;
    }

    public static MedicationResponse from(Medication medication) {
        MedicationResponse response = new MedicationResponse();
        response.drugName = medication.getDrugName();
        response.dosage = medication.getDosage().floatValue();
        response.unit = medication.getUnit().getLabel();
        response.frequency = medication.getCycle().toString().toLowerCase();  // DAILY -> daily 또는 WEEKLY -> weekly

        TimeData timeData = new TimeData();
        timeData.setHour(String.format("%02d", medication.getTime().getHour()));
        timeData.setMinute(String.format("%02d", medication.getTime().getMinute()));
        response.time = timeData;

        if (medication.getCycle() == MedicationCycle.WEEKLY) {
            response.weekday = medication.getDayOfWeek().toString().toLowerCase();
        }

        return response;
    }
}