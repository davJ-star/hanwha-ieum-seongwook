package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Normalized;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Transactional
public class TestController {
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/test")
    @ResponseBody
    public String test(){
        return "hello,world!";
    }

    @GetMapping("/db_test")
    @ResponseBody
    public String dbtest(){
        Optional<User> user = userRepository.findById(1);
        return user.get().getEmail();
    }

    @GetMapping("/encode_test")
    @ResponseBody
    public String encode() {
        return userService.encode("test");
    }
}
