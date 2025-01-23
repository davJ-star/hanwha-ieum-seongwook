package com.example.demo.repository;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import com.example.demo.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCategory(PostCategory category, org.springframework.data.domain.Pageable pageable);
    Page<Post> findByDisabilityType(DisabilityType disabilityType, Pageable pageable);
    Page<Post> findByCategoryAndDisabilityType(PostCategory category,
                                               DisabilityType disabilityType,
                                               org.springframework.data.domain.Pageable pageable);
}
