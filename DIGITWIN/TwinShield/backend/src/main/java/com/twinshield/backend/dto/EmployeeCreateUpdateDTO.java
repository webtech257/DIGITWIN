package com.twinshield.backend.dto;

public class EmployeeCreateUpdateDTO {
    private String id;
    private String name;
    private String email;
    private String department;
    private String status;
    private String password;
    private String roleId;
    private RoleDTO role;

    public EmployeeCreateUpdateDTO() {}

    public EmployeeCreateUpdateDTO(String id, String name, String email, String department, String status, String password, RoleDTO role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.status = status;
        this.password = password;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleDTO getRole() {
        return role;
    }

    public void setRole(RoleDTO role) {
        this.role = role;
    }

    public String getRoleId() {
        if (roleId != null && !roleId.isBlank()) return roleId.trim();
        return role != null ? role.getId() : null;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public static class RoleDTO {
        private String id;
        private String name;

        public RoleDTO() {}

        public RoleDTO(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
