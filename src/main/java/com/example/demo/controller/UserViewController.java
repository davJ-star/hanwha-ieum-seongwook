package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.service.EmailVerificationService;
import com.example.demo.service.MedicationService;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
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
    public String redirectToMyPage(@AuthenticationPrincipal User user) {
        return "redirect:/" + user.getId() + "/mypage";
    }

    @GetMapping("/{id}/mypage")
    public ResponseEntity<MyPageResponse> getMyPage(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!user.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

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
    @PostMapping("/{id}/mypage/update")
    public String updateUser(@PathVariable Long id,
                             @AuthenticationPrincipal User user,
                             @ModelAttribute UserUpdateRequest request,
                             RedirectAttributes redirectAttributes) {
        if (!user.getId().equals(id)) {
            return "redirect:/mypage";
        }
        try {
            userService.updateUser(user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "정보가 수정되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "정보 수정 중 오류가 발생했습니다.");
        }
        return "redirect:/" + id + "/mypage";
    }

    @PostMapping("/{id}/mypage/profile-image")
    public String updateProfileImage(@PathVariable Long id,
                                     @AuthenticationPrincipal User user,
                                     @RequestParam("image") MultipartFile file,
                                     RedirectAttributes redirectAttributes) {
        if (!user.getId().equals(id)) {
            return "redirect:/";
        }

        try {
            userService.updateProfileImage(user.getEmail(), file);
            redirectAttributes.addFlashAttribute("message", "프로필 이미지가 업데이트되었습니다.");
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("error", "이미지 업로드에 실패했습니다.");
        }
        return "redirect:/" + id + "/mypage";
    }

    @PostMapping("/{id}/mypage/password")
    public String updatePassword(@PathVariable Long id,
                                 @AuthenticationPrincipal User user,
                                 @ModelAttribute PasswordUpdateRequest request,
                                 RedirectAttributes redirectAttributes) {
        if (!user.getId().equals(id)) {
            return "redirect:/";
        }

        try {
            userService.updatePassword(user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "비밀번호가 변경되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "비밀번호 변경 중 오류가 발생했습니다.");
        }
        return "redirect:/" + id + "/mypage";
    }

    @DeleteMapping("/{id}/mypage/delete")
    public String deleteUser(@PathVariable Long id,
                             @AuthenticationPrincipal User user,
                             @ModelAttribute UserDeleteRequest request,
                             HttpServletRequest httpRequest,
                             RedirectAttributes redirectAttributes) {
        if (!user.getId().equals(id)) {
            return "redirect:/";
        }

        try {
            userService.deleteUser(user.getEmail(), request);
            SecurityContextHolder.clearContext();
            httpRequest.getSession().invalidate();
            redirectAttributes.addFlashAttribute("message", "회원 탈퇴가 완료되었습니다.");
            return "redirect:/login";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/" + id + "/mypage";
        }
    }

    @PostMapping("/{id}/mypage/medication")
    public String addMedication(@PathVariable Long id,
                                @AuthenticationPrincipal User user,
                                @ModelAttribute MedicationRequest request,
                                RedirectAttributes redirectAttributes) {
        if (!user.getId().equals(id)) {
            return "redirect:/";
        }

        try {
            medicationService.addMedication(user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "복용약이 추가되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/" + id + "/mypage";
    }


//    @GetMapping("/{id}/mypage/password")
//    public ResponseEntity<AccountResponse> getPasswordChangePage(@PathVariable Long id,
//                                                                 @AuthenticationPrincipal User user) {
//        if (!user.getId().equals(id)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//
//        AccountResponse response = new AccountResponse();
//        AccountResponse.AccountData accountData = new AccountResponse.AccountData();
//        AccountResponse.FieldsData fieldsData = new AccountResponse.FieldsData();
//
//        // User 정보 설정
//        AccountResponse.UserData userData = new AccountResponse.UserData();
//        userData.setId(user.getId());
//        userData.setName(user.getName());
//        userData.setEmail(user.getEmail());
//        // emailVerificationCode는 optional이므로 필요한 경우에만 설정
//
//        // PasswordChange 정보 설정
//        AccountResponse.PasswordChangeData passwordChangeData = new AccountResponse.PasswordChangeData();
//        passwordChangeData.setCurrentPassword("");  // 빈 문자열로 초기화
//        passwordChangeData.setNewPassword("");
//        passwordChangeData.setNewPasswordConfirm("");
//
//        // Response 조합
//        fieldsData.setUser(userData);
//        fieldsData.setPasswordChange(passwordChangeData);
//        accountData.setPath("src/main/resources/account.html");
//        accountData.setFields(fieldsData);
//        response.setAccount(accountData);
//
//        return ResponseEntity.ok(response);
//    }
}