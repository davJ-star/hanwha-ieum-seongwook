package com.example.demo.repository;
import com.example.demo.entity.ContentSection;
import com.example.demo.entity.HealthContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ContentSectionRepository extends JpaRepository<ContentSection, Long> {
    @Query(value = "SELECT * FROM content_sections WHERE content_id = :contentId", nativeQuery = true)
    List<ContentSection> findByContentId(@Param("contentId") String contentId);
}