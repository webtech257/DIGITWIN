package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_activities")
public class EmployeeActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "records_accessed")
    private Integer recordsAccessed = 1;

    @Column(name = "data_volume_bytes")
    private Long dataVolumeBytes = 0L;

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    public EmployeeActivity() {
        this.timestamp = LocalDateTime.now();
    }

    public EmployeeActivity(Session session, Employee employee, Resource resource, String actionType, Integer recordsAccessed, Long dataVolumeBytes) {
        this.session = session;
        this.employee = employee;
        this.resource = resource;
        this.actionType = actionType;
        this.recordsAccessed = recordsAccessed != null ? recordsAccessed : 1;
        this.dataVolumeBytes = dataVolumeBytes != null ? dataVolumeBytes : 0L;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public Integer getRecordsAccessed() { return recordsAccessed; }
    public void setRecordsAccessed(Integer recordsAccessed) { this.recordsAccessed = recordsAccessed; }

    public Long getDataVolumeBytes() { return dataVolumeBytes; }
    public void setDataVolumeBytes(Long dataVolumeBytes) { this.dataVolumeBytes = dataVolumeBytes; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
