package com.nourishconnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "users")
public class UserAccount {
    public enum Role { DONOR, ADMIN }

    @Id
    private String id = UUID.randomUUID().toString();
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String passwordHash;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    protected UserAccount() { }

    public UserAccount(String email, String passwordHash, String name, Role role) {
        this.email = email.toLowerCase().trim();
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getName() { return name; }
    public Role getRole() { return role; }
    public void updateProfile(String name, String email) {
        this.name = name.trim();
        this.email = email.toLowerCase().trim();
    }
}