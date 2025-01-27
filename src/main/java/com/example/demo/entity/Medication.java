package com.example.demo.entity;

import com.example.demo.Enum.DosageUnit;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String drugName;  // 약 이름

    private Double dosage;    // 복용량

    @Enumerated(EnumType.STRING)
    private DosageUnit unit;  // 단위

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }

    @Builder
    public Medication(User user, String drugName, Double dosage, DosageUnit unit) {
        this.user = user;
        this.drugName = drugName;
        this.dosage = dosage;
        this.unit = unit;
    }
}
