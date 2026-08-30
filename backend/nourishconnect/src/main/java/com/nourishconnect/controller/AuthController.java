package com.nourishconnect.controller;

import com.nourishconnect.dto.AuthDtos;
import com.nourishconnect.entity.UserAccount;
import com.nourishconnect.repository.DonationRepository;
import com.nourishconnect.repository.UserAccountRepository;
import com.nourishconnect.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserAccountRepository users; private final DonationRepository donations; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(UserAccountRepository users, DonationRepository donations, PasswordEncoder encoder, JwtService jwt) { this.users = users; this.donations = donations; this.encoder = encoder; this.jwt = jwt; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        if (users.findByEmailIgnoreCase(request.email()).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered");
        UserAccount user = users.save(new UserAccount(request.email(), encoder.encode(request.password()), request.name(), UserAccount.Role.DONOR));
        return ResponseEntity.ok(response(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return users.findByEmailIgnoreCase(request.email()).filter(user -> encoder.matches(request.password(), user.getPasswordHash()))
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(response(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        return users.findByEmailIgnoreCase(authentication.getName())
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(view(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated"));
    }

    @PutMapping("/me")
    public ResponseEntity<?> update(@Valid @RequestBody AuthDtos.ProfileRequest request, org.springframework.security.core.Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        var existing = users.findByEmailIgnoreCase(authentication.getName());
        if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        UserAccount user = existing.get();
        String oldEmail = user.getEmail(); user.updateProfile(request.name(), request.email());
        users.save(user);
        if (!oldEmail.equalsIgnoreCase(user.getEmail())) donations.findByDonorEmailIgnoreCaseOrderBySubmittedAtDesc(oldEmail).forEach(d -> { d.update(d.getDonor(), user.getEmail(), d.getFood(), d.getCategory(), d.getTag(), d.getHome(), d.getMeals(), d.getStatus()); donations.save(d); });
        return ResponseEntity.ok(response(user));
    }

    private AuthDtos.AuthResponse response(UserAccount user) { return new AuthDtos.AuthResponse(jwt.createToken(user.getEmail(), user.getRole().name().toLowerCase()), user.getEmail(), user.getName(), user.getRole().name().toLowerCase()); }
    private UserAccountView view(UserAccount user) { return new UserAccountView(user.getEmail(), user.getName(), user.getRole().name().toLowerCase()); }
    public record UserAccountView(String email, String name, String role) { }
}