package com.twinshield.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType;

    @Column(name = "sensitivity_score", nullable = false)
    private Integer sensitivityScore = 30;

    @Column(name = "is_decoy")
    private Boolean isDecoy = false;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public Resource() {}

    public Resource(String id, String name, String resourceType, Integer sensitivityScore, Boolean isDecoy, String description) {
        this.id = id;
        this.name = name;
        this.resourceType = resourceType;
        this.sensitivityScore = sensitivityScore;
        this.isDecoy = isDecoy != null ? isDecoy : false;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public Integer getSensitivityScore() { return sensitivityScore; }
    public void setSensitivityScore(Integer sensitivityScore) { this.sensitivityScore = sensitivityScore; }

    public Boolean getIsDecoy() { return isDecoy; }
    public void setIsDecoy(Boolean isDecoy) { this.isDecoy = isDecoy; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
