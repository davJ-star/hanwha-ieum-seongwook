package com.example.demo.controller;

import com.example.demo.dto.ReminderTestRequest;
import com.example.demo.service.EmailService;
import com.example.demo.service.MedicationReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test/medication")
public class MedicationReminderTestController {
    private final MedicationReminderService reminderService;
    private final EmailService emailService;

    // 전체 알림 시스템 테스트
    @PostMapping("/reminders/check")
    public ResponseEntity<Map<String, Object>> testCheckReminders() {
        Map<String, Object> response = new HashMap<>();
        try {
            reminderService.checkAndSendReminders();
            response.put("success", true);
            response.put("message", "알림 체크 및 발송 테스트가 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 특정 사용자에게 테스트 알림 발송
    @PostMapping("/reminders/send")
    public ResponseEntity<Map<String, Object>> testSendReminder(@RequestBody ReminderTestRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            emailService.sendMedicationReminder(
                    request.getEmail(),
                    request.getDrugName(),
                    request.getDosage(),
                    request.getUnit(),
                    LocalTime.of(request.getHour(), request.getMinute())
            );
            response.put("success", true);
            response.put("message", "테스트 알림이 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}