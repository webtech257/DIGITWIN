package com.twinshield.backend.repository;

import com.twinshield.backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    @Modifying
    @Query("DELETE FROM Incident inc WHERE inc.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") String employeeId);
}
