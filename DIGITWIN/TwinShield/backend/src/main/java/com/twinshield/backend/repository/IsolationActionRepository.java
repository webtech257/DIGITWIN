package com.twinshield.backend.repository;

import com.twinshield.backend.entity.IsolationAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IsolationActionRepository extends JpaRepository<IsolationAction, Long> {
    List<IsolationAction> findByStatus(String status);
}
