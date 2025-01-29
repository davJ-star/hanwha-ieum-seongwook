package com.example.demo.service;

import com.example.demo.Enum.MedicationCycle;
import com.example.demo.entity.Medication;
import com.example.demo.entity.MedicationReminder;
import com.example.demo.repository.MedicationReminderRepository;
import com.example.demo.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@EnableScheduling
@Slf4j
public class MedicationReminderService {
    private final MedicationRepository medicationRepository;
    private final EmailService emailService;
    private final MedicationReminderRepository reminderRepository;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkAndSendReminders() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();
        LocalDateTime currentDateTime = LocalDateTime.now();
        log.info("현재 시간: {}", now);

        List<Medication> activeMedications = medicationRepository.findActiveMedicationsWithUser();

        List<Medication> medicationsToRemind = activeMedications.stream()
                .filter(med -> {
                    boolean isCorrectDay = med.getCycle() == MedicationCycle.DAILY ||
                            (med.getCycle() == MedicationCycle.WEEKLY &&
                                    med.getDayOfWeek().equals(convertToCustomDayOfWeek(currentDateTime.getDayOfWeek())));

                    LocalTime medicationTime = med.getTime();
                    long minutesDifference = Math.abs(ChronoUnit.MINUTES.between(now, medicationTime));
                    boolean isCorrectTime = minutesDifference <= 1;

                    // 이미 알림을 보냈는지 체크
                    boolean alreadySent = reminderRepository.existsByMedicationAndReminderDateAndReminderTimeBetween(
                            med,
                            today,
                            medicationTime.minusMinutes(1),
                            medicationTime.plusMinutes(1)
                    );

                    log.info("약: {}, 시간 차이(분): {}, 알림 발송 여부: {}, 이미 발송됨: {}",
                            med.getDrugName(), minutesDifference, isCorrectTime, alreadySent);

                    return isCorrectDay && isCorrectTime && !alreadySent;
                })
                .collect(Collectors.toList());

        for (Medication medication : medicationsToRemind) {
            try {
                emailService.sendMedicationReminder(
                        medication.getUser().getEmail(),
                        medication.getDrugName(),
                        medication.getDosage(),
                        medication.getUnit(),
                        medication.getTime()
                );

                // 알림 이력 저장
                MedicationReminder reminder = MedicationReminder.builder()
                        .medication(medication)
                        .reminderDate(today)
                        .reminderTime(medication.getTime())
                        .build();
                reminderRepository.save(reminder);

                log.info("알림 발송 성공 - 약: {}, 사용자: {}",
                        medication.getDrugName(), medication.getUser().getEmail());
            } catch (Exception e) {
                log.error("알림 발송 실패 - 약: {}", medication.getDrugName(), e);
            }
        }
    }

    // Java의 DayOfWeek를 커스텀 DayOfWeek로 변환하는 메소드
    private com.example.demo.Enum.DayOfWeek convertToCustomDayOfWeek(java.time.DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> com.example.demo.Enum.DayOfWeek.MONDAY;
            case TUESDAY -> com.example.demo.Enum.DayOfWeek.TUESDAY;
            case WEDNESDAY -> com.example.demo.Enum.DayOfWeek.WEDNESDAY;
            case THURSDAY -> com.example.demo.Enum.DayOfWeek.THURSDAY;
            case FRIDAY -> com.example.demo.Enum.DayOfWeek.FRIDAY;
            case SATURDAY -> com.example.demo.Enum.DayOfWeek.SATURDAY;
            case SUNDAY -> com.example.demo.Enum.DayOfWeek.SUNDAY;
        };
    }
}