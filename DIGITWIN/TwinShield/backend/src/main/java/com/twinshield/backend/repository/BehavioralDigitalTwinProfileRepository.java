package com.twinshield.backend.repository;

import com.twinshield.backend.entity.BehavioralDigitalTwinProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BehavioralDigitalTwinProfileRepository extends JpaRepository<BehavioralDigitalTwinProfile, String> {
}
