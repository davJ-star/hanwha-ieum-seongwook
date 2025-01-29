package com.example.demo.repository;

import com.example.demo.entity.Medication;
import com.example.demo.entity.MedicationReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

@Repository
public interface MedicationReminderRepository extends JpaRepository<MedicationReminder, Long> {
    boolean existsByMedicationAndReminderDateAndReminderTimeBetween(
            Medication medication,
            LocalDate reminderDate,
            LocalTime startTime,
            LocalTime endTime
    );
}