package com.nourishconnect.dto;

public final class DomainDtos {
    private DomainDtos() { }
    public record HomeRequest(String name, String region, int capacity) { }
    public record DonationRequest(String donor, String donorEmail, String food, String category, String tag, String home, int meals, String status) { }
}