package com.twinshield.backend.repository;

import com.twinshield.backend.entity.IsolationAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IsolationActionRepository extends JpaRepository<IsolationAction, Long> {
    List<IsolationAction> findByStatus(String status);

    @Modifying
    @Query("DELETE FROM IsolationAction ia WHERE ia.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") String employeeId);
}
