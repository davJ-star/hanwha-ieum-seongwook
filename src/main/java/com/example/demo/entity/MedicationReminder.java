package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medication_reminders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MedicationReminder extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(nullable = false)
    private LocalDate reminderDate;

    @Column(nullable = false)
    private LocalTime reminderTime;

    @Builder
    public MedicationReminder(Medication medication, LocalDate reminderDate, LocalTime reminderTime) {
        this.medication = medication;
        this.reminderDate = reminderDate;
        this.reminderTime = reminderTime;
    }
}