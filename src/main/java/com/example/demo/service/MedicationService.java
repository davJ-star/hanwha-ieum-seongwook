package com.example.demo.service;

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

        Medication medication = Medication.builder()
                .user(user)
                .drugName(request.getDrugName())
                .dosage(request.getDosage())
                .unit(request.getUnit())
                .build();

        return medicationRepository.save(medication).getId();
    }

    public List<MedicationResponse> getUserMedications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return medicationRepository.findByUserOrderByAddedAtDesc(user).stream()
                .map(MedicationResponse::from)
                .collect(Collectors.toList());
    }
}