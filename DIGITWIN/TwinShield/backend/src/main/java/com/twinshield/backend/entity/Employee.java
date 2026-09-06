package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @Column(name = "password", length = 100)
    private String password = "TwinShield@2026";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Employee() {
        this.createdAt = LocalDateTime.now();
    }

    public Employee(String id, String name, String email, String department, Role role, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.role = role;
        this.status = status != null ? status : "ACTIVE";
        this.password = "TwinShield@2026";
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
