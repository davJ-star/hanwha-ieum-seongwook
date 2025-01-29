package com.example.demo.entity;

import com.example.demo.Enum.DayOfWeek;
import com.example.demo.Enum.DosageUnit;
import com.example.demo.Enum.MedicationCycle;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Medication extends BaseTimeEntity {  // 생성/수정 시간을 위한 BaseTimeEntity 상속
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String drugName;  // 약 이름

    @Column(nullable = false)
    @PositiveOrZero  // 양수 또는 0만 허용
    private Double dosage;    // 복용량

    @Enumerated(EnumType.STRING)
    @Column(name = "unit", length = 20)  // 컬럼 길이를 충분히 설정
    private DosageUnit unit;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MedicationCycle cycle;  // 복용 주기

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;    // 주간 복용 요일

    @Column(nullable = false)
    private LocalTime time;         // 복용 시간

    @Column(nullable = false)
    private boolean isActive = true;  // 활성화 상태

    @Builder(builderClassName = "MedicationBuilder")
    public Medication(User user, String drugName, Double dosage, DosageUnit unit,
                      MedicationCycle cycle, DayOfWeek dayOfWeek, LocalTime time) {
        validateMedication(user, drugName, dosage, unit, cycle, dayOfWeek, time);

        this.user = user;
        this.drugName = drugName;
        this.dosage = dosage;
        this.unit = unit;
        this.cycle = cycle;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
    }

    // 유효성 검증 메소드
    private void validateMedication(User user, String drugName, Double dosage,
                                    DosageUnit unit, MedicationCycle cycle,
                                    DayOfWeek dayOfWeek, LocalTime time) {
        if (user == null) {
            throw new IllegalArgumentException("사용자 정보는 필수입니다.");
        }
        if (StringUtils.isBlank(drugName)) {
            throw new IllegalArgumentException("약 이름은 필수입니다.");
        }
        if (dosage == null || dosage < 0) {
            throw new IllegalArgumentException("올바른 복용량을 입력해주세요.");
        }
        if (unit == null) {
            throw new IllegalArgumentException("복용 단위는 필수입니다.");
        }
        if (cycle == null) {
            throw new IllegalArgumentException("복용 주기는 필수입니다.");
        }
        if (cycle == MedicationCycle.WEEKLY && dayOfWeek == null) {
            throw new IllegalArgumentException("주간 복용 시 요일 선택은 필수입니다.");
        }
        if (time == null) {
            throw new IllegalArgumentException("복용 시간은 필수입니다.");
        }
    }

    // 비즈니스 메소드
    public void deactivate() {
        this.isActive = false;
    }

    public void updateMedicationInfo(String drugName, Double dosage, DosageUnit unit,
                                     MedicationCycle cycle, DayOfWeek dayOfWeek, LocalTime time) {
        validateMedication(this.user, drugName, dosage, unit, cycle, dayOfWeek, time);

        this.drugName = drugName;
        this.dosage = dosage;
        this.unit = unit;
        this.cycle = cycle;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
    }

}
