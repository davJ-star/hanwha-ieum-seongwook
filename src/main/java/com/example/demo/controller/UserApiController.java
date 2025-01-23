package com.example.demo.controller;

import com.example.demo.dto.AddUserRequest;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    private final UserService service;

    @PostMapping("/user")
    public String signup(AddUserRequest request){
        service.save(request); //회원 가입 메서드 호출
        return "redirect:/login"; //회원 가입이 완료된 이후에 로그인 페이지로 이동
    }
}