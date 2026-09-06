package com.twinshield.backend.repository;

import com.twinshield.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    Optional<Session> findBySessionId(String sessionId);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") String employeeId);
}
