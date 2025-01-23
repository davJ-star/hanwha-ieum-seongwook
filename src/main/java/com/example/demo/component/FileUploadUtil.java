package com.example.demo.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {
    @Value("${spring.config.upload.dir}")
    private String uploadDir;

    public String saveFile(String email, MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

        // 사용자별 디렉토리 생성
        String userUploadDir = uploadDir + "/" + email;
        Path uploadPath = Paths.get(userUploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 파일 저장
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 웹에서 접근 가능한 경로 반환
        return "/static/" + email + "/" + uniqueFileName;
    }
}