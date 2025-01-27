package com.example.demo.repository;

import com.example.demo.entity.Medication;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByUserOrderByAddedAtDesc(User user);
}