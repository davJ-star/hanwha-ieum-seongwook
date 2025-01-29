package com.example.demo.dto;

import com.example.demo.Enum.DayOfWeek;
import com.example.demo.Enum.DosageUnit;
import com.example.demo.Enum.MedicationCycle;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicationRequest {
    @NotBlank(message = "약 이름은 필수입니다.")
    private String drugName;

    @NotNull(message = "복용량은 필수입니다.")
    @Positive(message = "복용량은 양수여야 합니다.")
    private Double dosage;

    @NotNull(message = "복용 단위는 필수입니다.")
    private DosageUnit unit;

    @NotNull(message = "복용 주기는 필수입니다.")
    private MedicationCycle cycle;

    private DayOfWeek dayOfWeek;  // WEEKLY일 때만 필수

    @NotNull(message = "복용 시간(시)은 필수입니다.")
    @Min(0) @Max(23)
    private Integer hour;

    @NotNull(message = "복용 시간(분)은 필수입니다.")
    @Min(0) @Max(59)
    private Integer minute;
}