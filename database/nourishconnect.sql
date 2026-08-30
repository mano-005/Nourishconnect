-- NourishConnect MySQL database
-- Run this file in MySQL Workbench before starting the Spring Boot backend.

CREATE DATABASE IF NOT EXISTS nourishconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nourishconnect;

-- Spring Boot/JPA will maintain the tables because
-- spring.jpa.hibernate.ddl-auto=update.
-- These CREATE TABLE statements are also provided so the
-- database structure is clear and can be used immediately.

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS receiving_homes (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(36) NOT NULL,
    donor VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    food VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    tag VARCHAR(255),
    home VARCHAR(255) NOT NULL,
    meals INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Optional sample receiving homes.
-- DataInitializer.java also creates these automatically when
-- the receiving_homes table is empty, so you do not need to run
-- these INSERTs if you keep DataInitializer enabled.

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Maple Street Pantry', 'North district', 82
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Maple Street Pantry');

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Cedar Grove Home', 'East district', 54
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Cedar Grove Home');

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Riverside Shelter', 'South district', 91
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Riverside Shelter');

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Sunshine Orphanage', 'West district', 63
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Sunshine Orphanage');

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Downtown Shelter', 'Central district', 47
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Downtown Shelter');

INSERT INTO receiving_homes (id, name, region, capacity)
SELECT UUID(), 'Community Kitchen West', 'West district', 76
WHERE NOT EXISTS (SELECT 1 FROM receiving_homes WHERE name = 'Community Kitchen West');
