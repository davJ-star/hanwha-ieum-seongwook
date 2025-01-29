package com.example.demo.service;

import com.example.demo.Enum.MedicationCycle;
import com.example.demo.dto.DrugBasicResponse;
import com.example.demo.dto.MedicationRequest;
import com.example.demo.dto.MedicationResponse;
import com.example.demo.entity.Medication;
import com.example.demo.entity.User;
import com.example.demo.repository.MedicationRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicationService {
    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;
    private final SearchService searchService;  // 기존 약 검색 서비스

    @Transactional
    public Long addMedication(String email, MedicationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 약 검색으로 유효성 검증
        List<DrugBasicResponse> searchResult = searchService.searchAndSave(request.getDrugName());
        if (searchResult.isEmpty()) {
            throw new RuntimeException("존재하지 않는 약입니다.");
        }

        // 복용 주기 유효성 검증
        if (request.getCycle() == MedicationCycle.WEEKLY && request.getDayOfWeek() == null) {
            throw new RuntimeException("주간 복용 시 요일을 선택해야 합니다.");
        }

        // 시간 유효성 검증
        if (request.getHour() == null || request.getMinute() == null ||
                request.getHour() < 0 || request.getHour() > 23 ||
                request.getMinute() < 0 || request.getMinute() > 59) {
            throw new RuntimeException("올바른 시간을 입력해주세요.");
        }

        LocalTime medicationTime = LocalTime.of(request.getHour(), request.getMinute());

        Medication medication = Medication.builder()
                .user(user)
                .drugName(request.getDrugName())
                .dosage(request.getDosage())
                .unit(request.getUnit())
                .cycle(request.getCycle())
                .dayOfWeek(request.getDayOfWeek())  // WEEKLY인 경우에만 값이 들어감
                .time(medicationTime)
                .build();

        return medicationRepository.save(medication).getId();
    }

    public List<MedicationResponse> getUserMedications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return medicationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(MedicationResponse::from)
                .collect(Collectors.toList());
    }
}