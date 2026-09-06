package com.twinshield.backend.repository;

import com.twinshield.backend.entity.SecurityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
    List<SecurityEvent> findAllByOrderByIdDesc();

    @Modifying
    @Query("DELETE FROM SecurityEvent se WHERE se.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") String employeeId);
}
