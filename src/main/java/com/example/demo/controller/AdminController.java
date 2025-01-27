package com.example.demo.controller;

import com.example.demo.dto.AddUserRequest;
import com.example.demo.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;

    @GetMapping("/admin")
    public void admin(@ModelAttribute AddUserRequest request){
        userService.createAdmin(request);
    }
}
