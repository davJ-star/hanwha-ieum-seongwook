package com.example.demo.entity;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 20)
    private PostCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisabilityType disabilityType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public Post(String title, String content, PostCategory category,
                DisabilityType disabilityType, User author) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.disabilityType = disabilityType;
        this.author = author;
    }

    public void update(String title, String content,
                       PostCategory category, DisabilityType disabilityType) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.disabilityType = disabilityType;
    }
}
