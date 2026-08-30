package com.nourishconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "receiving_homes")
public class Home {
    @Id private String id = UUID.randomUUID().toString();
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String region;
    @Column(nullable = false) private int capacity;

    protected Home() { }
    public Home(String name, String region, int capacity) { this.name = name; this.region = region; this.capacity = capacity; }
    public String getId() { return id; }
    public String getName() { return name; }
    public String getRegion() { return region; }
    public int getCapacity() { return capacity; }
    public void update(String name, String region, int capacity) { this.name = name; this.region = region; this.capacity = capacity; }
}