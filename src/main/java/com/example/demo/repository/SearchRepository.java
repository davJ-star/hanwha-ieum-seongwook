package com.example.demo.repository;

import com.example.demo.entity.Search;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SearchRepository extends JpaRepository<Search,Long> {
    Optional<Search> findById(Long id);
    boolean existsByItemName(String itemName);
    Search findByItemName(String itemname);
}
