package com.twinshield.backend.service;

import com.twinshield.backend.entity.SecurityEvent;
import com.twinshield.backend.repository.SecurityEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityEventService {

    private final SecurityEventRepository securityEventRepository;

    @Autowired
    public SecurityEventService(SecurityEventRepository securityEventRepository) {
        this.securityEventRepository = securityEventRepository;
    }

    public List<SecurityEvent> getAllSecurityEvents() {
        return securityEventRepository.findAllByOrderByIdDesc();
    }

}
