package com.example.demo.repository;

import com.example.demo.entity.HealthContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthContentRepository extends JpaRepository<HealthContent, String> {
    @Query(value = "SELECT * FROM health_contents WHERE title LIKE CONCAT('%', :keyword, '%')", nativeQuery = true)
    List<HealthContent> searchByTitleKeyword(@Param("keyword") String keyword);
}