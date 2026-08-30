package com.nourishconnect.controller;

import com.nourishconnect.dto.DomainDtos;
import com.nourishconnect.entity.Donation;
import com.nourishconnect.repository.DonationRepository;
import com.nourishconnect.repository.UserAccountRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
public class DonationController {
    private final DonationRepository donations; private final UserAccountRepository users;
    public DonationController(DonationRepository donations, UserAccountRepository users) { this.donations = donations; this.users = users; }

    @GetMapping public Iterable<Donation> all(org.springframework.security.core.Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? donations.findAll() : donations.findByDonorEmailIgnoreCaseOrderBySubmittedAtDesc(auth.getName());
    }
    @PostMapping public Donation create(@RequestBody DomainDtos.DonationRequest request, org.springframework.security.core.Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        var donor = admin && request.donorEmail() != null && !request.donorEmail().isBlank()
                ? users.findByEmailIgnoreCase(request.donorEmail()).orElseThrow()
                : users.findByEmailIgnoreCase(auth.getName()).orElseThrow();

        String status = admin && request.status() != null && !request.status().isBlank()
                ? request.status()
                : "pending";

        return donations.save(new Donation(
                admin && request.donor() != null && !request.donor().isBlank() ? request.donor() : donor.getName(),
                donor.getEmail(), request.food(), request.category(), request.tag(), request.home(),
                request.meals(), status));
    }
    @PutMapping("/{id}") public Donation update(@PathVariable String id, @RequestBody DomainDtos.DonationRequest request, org.springframework.security.core.Authentication auth) {
        Donation donation = owned(id, auth);
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        String donorName = donation.getDonor();
        String donorEmail = donation.getDonorEmail();
        if (admin && request.donorEmail() != null && !request.donorEmail().isBlank()) {
            var donor = users.findByEmailIgnoreCase(request.donorEmail()).orElseThrow();
            donorName = request.donor() != null && !request.donor().isBlank() ? request.donor() : donor.getName();
            donorEmail = donor.getEmail();
        }

        donation.update(donorName, donorEmail, request.food(), request.category(), request.tag(),
                request.home(), request.meals(), admin ? request.status() : null);
        return donations.save(donation);
    }
    @DeleteMapping("/{id}") public void delete(@PathVariable String id, org.springframework.security.core.Authentication auth) { donations.delete(owned(id, auth)); }
    @PutMapping("/{id}/status/{status}") @PreAuthorize("hasRole('ADMIN')") public Donation status(@PathVariable String id, @PathVariable String status) { Donation donation = donations.findById(id).orElseThrow(); donation.setStatus(status); return donations.save(donation); }

    private Donation owned(String id, org.springframework.security.core.Authentication auth) {
        Donation donation = donations.findById(id).orElseThrow();
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin && !donation.getDonorEmail().equalsIgnoreCase(auth.getName())) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
        return donation;
    }
}