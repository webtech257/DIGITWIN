package com.twinshield.backend.repository;

import com.twinshield.backend.entity.EmployeeActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeActivityRepository extends JpaRepository<EmployeeActivity, Long> {
    @Modifying
    @Query("DELETE FROM EmployeeActivity ea WHERE ea.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") String employeeId);
}
