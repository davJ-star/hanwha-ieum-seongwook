package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "content_sections")
@Getter @Setter
@NoArgsConstructor
public class ContentSection {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "content_id")  // 컬럼명 확인
    private String contentId;

    @Column(name = "section_name")  // 컬럼명 확인
    private String sectionName;

    private String sectionId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;
}