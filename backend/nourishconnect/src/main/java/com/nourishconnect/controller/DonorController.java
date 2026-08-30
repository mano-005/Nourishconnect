package com.nourishconnect.controller;

import com.nourishconnect.entity.UserAccount;
import com.nourishconnect.repository.UserAccountRepository;
import com.nourishconnect.repository.DonationRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/donors")
@PreAuthorize("hasRole('ADMIN')")
public class DonorController {
    private final UserAccountRepository users;
    private final DonationRepository donations;

    public DonorController(UserAccountRepository users, DonationRepository donations) {
        this.users = users;
        this.donations = donations;
    }

    @GetMapping
    public Iterable<DonorView> all() {
        return users.findAll().stream()
                .filter(user -> user.getRole() == UserAccount.Role.DONOR)
                .map(this::view)
                .toList();
    }

    @PostMapping
    public DonorView create(@RequestBody DonorRequest request) {
        if (users.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        return view(users.save(new UserAccount(request.email(), "", request.name(), UserAccount.Role.DONOR)));
    }

    @PutMapping("/{id}")
    public DonorView update(@PathVariable String id, @RequestBody DonorRequest request) {
        UserAccount user = users.findById(id).orElseThrow();
        users.findByEmailIgnoreCase(request.email()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
            }
        });
        String oldEmail = user.getEmail();
        user.updateProfile(request.name(), request.email());
        users.save(user);

        if (!oldEmail.equalsIgnoreCase(user.getEmail())) {
            donations.findByDonorEmailIgnoreCaseOrderBySubmittedAtDesc(oldEmail).forEach(donation -> {
                donation.update(donation.getDonor(), user.getEmail(), donation.getFood(), donation.getCategory(),
                        donation.getTag(), donation.getHome(), donation.getMeals(), donation.getStatus());
                donations.save(donation);
            });
        }

        return view(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        users.deleteById(id);
    }

    private DonorView view(UserAccount user) {
        return new DonorView(user.getId(), user.getName(), user.getEmail());
    }

    public record DonorRequest(String name, String email) { }
    public record DonorView(String id, String name, String email) { }
}