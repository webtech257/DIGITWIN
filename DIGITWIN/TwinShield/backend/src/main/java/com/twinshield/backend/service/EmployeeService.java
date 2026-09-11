package com.twinshield.backend.service;

import com.twinshield.backend.dto.EmployeeCreateUpdateDTO;
import com.twinshield.backend.entity.Employee;
import com.twinshield.backend.entity.Role;
import com.twinshield.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final EmployeeActivityRepository employeeActivityRepository;
    private final SecurityEventRepository securityEventRepository;
    private final IsolationActionRepository isolationActionRepository;
    private final IncidentRepository incidentRepository;
    private final SessionRepository sessionRepository;
    private final BehavioralDigitalTwinProfileRepository profileRepository;

    @Autowired
    public EmployeeService(
            EmployeeRepository employeeRepository,
            RoleRepository roleRepository,
            EmployeeActivityRepository employeeActivityRepository,
            SecurityEventRepository securityEventRepository,
            IsolationActionRepository isolationActionRepository,
            IncidentRepository incidentRepository,
            SessionRepository sessionRepository,
            BehavioralDigitalTwinProfileRepository profileRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.employeeActivityRepository = employeeActivityRepository;
        this.securityEventRepository = securityEventRepository;
        this.isolationActionRepository = isolationActionRepository;
        this.incidentRepository = incidentRepository;
        this.sessionRepository = sessionRepository;
        this.profileRepository = profileRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional
    public Employee saveOrUpdateEmployee(EmployeeCreateUpdateDTO dto) {
        String empId = dto.getId() != null && !dto.getId().isBlank() ? dto.getId().trim() : "EMP" + (1000 + (int)(Math.random() * 8999));
        
        Optional<Employee> existingOpt = employeeRepository.findById(empId);
        Employee employee = existingOpt.orElseGet(Employee::new);

        employee.setId(empId);
        if (dto.getName() != null) employee.setName(dto.getName());
        if (dto.getEmail() != null) employee.setEmail(dto.getEmail());
        if (dto.getDepartment() != null) employee.setDepartment(dto.getDepartment());
        if (dto.getStatus() != null) employee.setStatus(dto.getStatus());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) employee.setPassword(dto.getPassword());

        String roleId = dto.getRoleId() != null ? dto.getRoleId() : "ROLE_CUST_SERVICE";
        Role role = roleRepository.findById(roleId)
                .orElseGet(() -> roleRepository.findById("ROLE_CUST_SERVICE")
                .orElseGet(() -> {
                    List<Role> all = roleRepository.findAll();
                    return all.isEmpty() ? null : all.get(0);
                }));
        if (role == null) {
            role = new Role("ROLE_CUST_SERVICE", "Customer Service Representative", "Default customer service staff");
            role = roleRepository.save(role);
        }
        employee.setRole(role);

        Employee saved = employeeRepository.save(employee);

        if (!profileRepository.existsById(empId)) {
            com.twinshield.backend.entity.BehavioralDigitalTwinProfile profile = new com.twinshield.backend.entity.BehavioralDigitalTwinProfile();
            profile.setEmployeeId(empId);
            profile.setNormalStartHour(9);
            profile.setNormalEndHour(18);
            profile.setAvgDailyAccesses(25);
            profile.setAvgSessionDurationMinutes(480);
            profile.setNormalLocation("Chennai");
            profile.setKnownDevices("[\"BANK-PC-" + empId + "\"]");
            profile.setKnownIpRanges("[\"192.168.1.0/24\"]");
            profile.setTypicalResources("[\"/api/v1/customer/profile\", \"/api/v1/transactions/search\"]");
            profileRepository.save(profile);
        }

        return saved;
    }

    @Transactional
    public boolean deleteEmployee(String id) {
        if (employeeRepository.existsById(id)) {
            // Cascade delete child entities in correct dependency order
            isolationActionRepository.deleteByEmployeeId(id);
            incidentRepository.deleteByEmployeeId(id);
            employeeActivityRepository.deleteByEmployeeId(id);
            securityEventRepository.deleteByEmployeeId(id);
            sessionRepository.deleteByEmployeeId(id);
            if (profileRepository.existsById(id)) {
                profileRepository.deleteById(id);
            }
            employeeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
