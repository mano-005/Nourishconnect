package com.nourishconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "donations")
public class Donation {
    @Id private String id = UUID.randomUUID().toString();
    @Column(nullable = false) private String donor;
    @Column(nullable = false) private String donorEmail;
    @Column(nullable = false) private String food;
    @Column(nullable = false) private String category;
    private String tag;
    @Column(nullable = false) private String home;
    @Column(nullable = false) private int meals;
    @Column(nullable = false) private String status = "pending";
    @Column(nullable = false) private Instant submittedAt = Instant.now();

    protected Donation() { }
    public Donation(String donor, String donorEmail, String food, String category, String tag, String home, int meals, String status) {
        this.donor = donor; this.donorEmail = donorEmail.toLowerCase().trim(); this.food = food; this.category = category;
        this.tag = tag; this.home = home; this.meals = meals; this.status = status == null ? "pending" : status;
    }
    public String getId() { return id; }
    public String getDonor() { return donor; }
    public String getDonorEmail() { return donorEmail; }
    public String getFood() { return food; }
    public String getCategory() { return category; }
    public String getTag() { return tag; }
    public String getHome() { return home; }
    public int getMeals() { return meals; }
    public String getStatus() { return status; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void update(String donor, String donorEmail, String food, String category, String tag, String home, int meals, String status) {
        this.donor = donor; if (donorEmail != null) this.donorEmail = donorEmail.toLowerCase().trim(); this.food = food;
        this.category = category; this.tag = tag; this.home = home; this.meals = meals; if (status != null) this.status = status;
    }
    public void setStatus(String status) { this.status = status; }
}