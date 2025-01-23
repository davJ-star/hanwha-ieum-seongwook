package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "health_contents")
@Getter @Setter
@NoArgsConstructor
public class HealthContent {
    @Id
    @Column(name = "content_id")
    private String contentId;
    private String title;
    private String categoryId;

    @Column(name = "update_date")
    private LocalDateTime updateDate;
}