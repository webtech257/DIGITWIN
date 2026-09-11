package com.twinshield.backend.controller;

import com.twinshield.backend.dto.EmployeeCreateUpdateDTO;
import com.twinshield.backend.entity.Employee;
import com.twinshield.backend.entity.Role;
import com.twinshield.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(employeeService.getAllRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = {"", "/create-or-update"})
    public ResponseEntity<?> createOrUpdateEmployee(
            @RequestBody EmployeeCreateUpdateDTO dto,
            @RequestHeader(value = "X-Client-Source", required = false) String clientSource,
            @RequestHeader(value = "X-Requester-Role", required = false) String requesterRole,
            @RequestHeader(value = "Origin", required = false) String origin,
            @RequestHeader(value = "Referer", required = false) String referer) {

        boolean isSocAuthorized = "SOC_DASHBOARD".equalsIgnoreCase(clientSource)
                || "ROLE_SECURITY_ANALYST".equalsIgnoreCase(requesterRole)
                || (origin != null && origin.contains("5174"))
                || (referer != null && referer.contains("5174"));

        if (!isSocAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(java.util.Map.of(
                    "error", "Access Denied: Only Security Operations Center (SOC) personnel have authority to provision employees.",
                    "status", 403,
                    "policy", "EXCLUSIVE_SOC_AUTHORITY"
            ));
        }

        try {
            Employee saved = employeeService.saveOrUpdateEmployee(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", e.getMessage() != null ? e.getMessage() : e.toString(), "type", e.getClass().getName()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody EmployeeCreateUpdateDTO dto) {
        try {
            dto.setId(id);
            Employee saved = employeeService.saveOrUpdateEmployee(dto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", e.getMessage() != null ? e.getMessage() : e.toString(), "type", e.getClass().getName()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(
            @PathVariable String id,
            @RequestHeader(value = "X-Client-Source", required = false) String clientSource,
            @RequestHeader(value = "X-Requester-Role", required = false) String requesterRole,
            @RequestHeader(value = "Origin", required = false) String origin,
            @RequestHeader(value = "Referer", required = false) String referer) {

        boolean isSocAuthorized = "SOC_DASHBOARD".equalsIgnoreCase(clientSource)
                || "ROLE_SECURITY_ANALYST".equalsIgnoreCase(requesterRole)
                || (origin != null && origin.contains("5174"))
                || (referer != null && referer.contains("5174"));

        if (!isSocAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(java.util.Map.of(
                    "error", "Access Denied: Only Security Operations Center (SOC) personnel have authority to decommission employees.",
                    "status", 403,
                    "policy", "EXCLUSIVE_SOC_AUTHORITY"
            ));
        }

        boolean deleted = employeeService.deleteEmployee(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
