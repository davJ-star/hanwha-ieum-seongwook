package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.service.EmailVerificationService;
import com.example.demo.service.MedicationService;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class UserViewController {
    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final MedicationService medicationService;

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";  // login.html을 보여줌
    }

    @GetMapping("/signup")
    public String signupForm() {
        return "signup";
    }



    @PostMapping("/signup")
    @ResponseBody  // AJAX 응답을 위해 추가
    public ResponseEntity<?> signup(@ModelAttribute AddUserRequest request) {
        try {
            // 이메일 인증 상태 확인
            if (!emailVerificationService.isEmailVerified(request.getEmail())) {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "이메일 인증이 필요합니다."
                ));
            }

            userService.save(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "회원가입이 완료되었습니다."
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/mypage")
    public String redirectToMyPage(@AuthenticationPrincipal User user) {
        return "redirect:/" + user.getId() + "/mypage";
    }

    @GetMapping("/{id}/mypage")
    public String myPage(@PathVariable Long id, @AuthenticationPrincipal User user, Model model) {
        if (!user.getId().equals(id)) {
            return "redirect:/";
        }

        User userInfo = userService.getMyInfo(user.getEmail());
        List<MedicationResponse> medications = medicationService.getUserMedications(user.getEmail());

        model.addAttribute("user", userInfo);
        model.addAttribute("medications", medications);  // 추가
        return "mypage";
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

    @PostMapping("/{id}/mypage/delete")
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
}