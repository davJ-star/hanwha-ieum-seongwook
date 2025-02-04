package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.service.EmailVerificationService;
import com.example.demo.service.MedicationService;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserViewController {
    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final MedicationService medicationService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest request) {
        try {
            // 이메일 인증 상태 확인
            if (!emailVerificationService.isEmailVerified(request.getEmail())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "이메일 인증이 필요합니다.");
                return ResponseEntity.ok(response);
            }

            userService.save(request);

            // 성공 시 필드 정보를 포함한 응답
            Map<String, Object> fieldsInfo = new HashMap<>();
            fieldsInfo.put("email", "String");
            fieldsInfo.put("password", "String");
            fieldsInfo.put("verificationCode", "String (optional)");
            fieldsInfo.put("nickname", "String");
            fieldsInfo.put("profileImage", "String (optional)");
            fieldsInfo.put("passwordConfirm", "String");

            Map<String, Object> signupData = new HashMap<>();
            signupData.put("path", "src/main/resources/templates/signup.html");
            signupData.put("fields", fieldsInfo);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("signup", signupData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    @GetMapping("/signup")
    public ResponseEntity<Map<String, Object>> signupForm() {
        Map<String, Object> fieldsInfo = new HashMap<>();
        fieldsInfo.put("email", "String");
        fieldsInfo.put("password", "String");
        fieldsInfo.put("verificationCode", "String (optional)");
        fieldsInfo.put("nickname", "String");
        fieldsInfo.put("profileImage", "String (optional)");
        fieldsInfo.put("passwordConfirm", "String");

        Map<String, Object> signupData = new HashMap<>();
        signupData.put("path", "src/main/resources/templates/signup.html");
        signupData.put("fields", fieldsInfo);

        return ResponseEntity.ok(Collections.singletonMap("signup", signupData));
    }


    @GetMapping("/mypage")
    public ResponseEntity<MyPageResponse> getMyPage(@AuthenticationPrincipal User user) {

        MyPageResponse response = new MyPageResponse();
        MyPageResponse.MypageData mypageData = new MyPageResponse.MypageData();
        MyPageResponse.FieldsData fieldsData = new MyPageResponse.FieldsData();

        // User 정보 설정
        User userInfo = userService.getMyInfo(user.getEmail());
        MyPageResponse.UserData userData = new MyPageResponse.UserData();
        userData.setId(userInfo.getId());
        userData.setNickname(userInfo.getName());
        userData.setProfileImage(userInfo.getProfileImage());

        // Medication 정보 설정
        List<MedicationResponse> medications = medicationService.getUserMedications(user.getEmail());
        List<MyPageResponse.MedicationData> medicationDataList = medications.stream()
                .map(med -> {
                    MyPageResponse.MedicationData medicationData = new MyPageResponse.MedicationData();
                    medicationData.setDrugName(med.getDrugName());
                    medicationData.setDosage(med.getDosage().floatValue());
                    medicationData.setUnit(med.getUnit());  // MedicationResponse에서 이미 String으로 변환된 unit을 사용
                    medicationData.setFrequency(med.getFrequency());  // 이미 소문자로 변환된 frequency 사용

                    MyPageResponse.TimeData timeData = new MyPageResponse.TimeData();
                    timeData.setHour(med.getTime().getHour());
                    timeData.setMinute(med.getTime().getMinute());
                    medicationData.setTime(timeData);

                    medicationData.setWeekday(med.getWeekday());  // 이미 변환된 weekday 사용

                    return medicationData;
                })
                .collect(Collectors.toList());

        fieldsData.setUser(userData);
        fieldsData.setMedications(medicationDataList);
        mypageData.setPath("src/main/resources/mypage.html");
        mypageData.setFields(fieldsData);
        response.setMypage(mypageData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/mypage/update")
    public ResponseEntity<String> updateUser(
            @AuthenticationPrincipal User user,
            @RequestParam String name
    ) {

        try {
            UserUpdateRequest request = new UserUpdateRequest();
            request.setName(name);

            userService.updateUser(user.getEmail(), request);
            return ResponseEntity.ok("정보가 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("정보 수정 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("mypage/profile-image")
    public ResponseEntity<String> updateProfileImage(
                                     @AuthenticationPrincipal User user,
                                     @RequestParam("image") MultipartFile file) {


        try {
            userService.updateProfileImage(user.getEmail(), file);
            return ResponseEntity.ok("정보가 수정되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("정보 수정 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/mypage/email")
    public ResponseEntity<String> emailChange(@AuthenticationPrincipal User user,
                                              @RequestParam("email") String email) {
        try {
            // 이메일 인증 상태 확인
            if (!emailVerificationService.isEmailVerified(email)) {
                Map<String, Object> response = new HashMap<>();
                return ResponseEntity.ok("이메일 인증이 필요합니다.");
            }
            userService.updateUserEmail(user.getEmail(),email);
            return ResponseEntity.ok("이메일 인증이 완료 되었습니다.");

        } catch (Exception e) {
            return ResponseEntity.ok("이메일 인증 중 오류가 발생햇습니다.");
        }
    }

    @PostMapping("/mypage/password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal User user,
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            @RequestParam String newPasswordConfirm
    ) {

        try {
            PasswordUpdateRequest request = new PasswordUpdateRequest();
            request.setCurrentPassword(currentPassword);
            request.setNewPassword(newPassword);
            request.setNewPasswordConfirm(newPasswordConfirm);

            userService.updatePassword(user.getEmail(), request);
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("비밀번호 변경 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/mypage/delete")
    public ResponseEntity<String> deleteUser(
            @AuthenticationPrincipal User user,
            @RequestParam String password,
            HttpServletRequest httpRequest
    ) {

        try {
            UserDeleteRequest request = new UserDeleteRequest();
            request.setPassword(password);

            userService.deleteUser(user.getEmail(), request);
            SecurityContextHolder.clearContext();
            httpRequest.getSession().invalidate();
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/mypage/medication")
    public ResponseEntity<String> addMedication(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid MedicationRequest request  // RequestParam -> RequestBody로 변경
    ) {

        try {
            medicationService.addMedication(user.getEmail(), request);
            return ResponseEntity.ok()
                    .body("복용약이 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}