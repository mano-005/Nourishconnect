package com.nourishconnect.controller;

import com.nourishconnect.dto.DomainDtos;
import com.nourishconnect.entity.Home;
import com.nourishconnect.repository.HomeRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/homes")
public class HomeController {
    private final HomeRepository homes;
    public HomeController(HomeRepository homes) { this.homes = homes; }
    @GetMapping public Iterable<Home> all() { return homes.findAll(); }
    @PostMapping @PreAuthorize("hasRole('ADMIN')") public Home create(@RequestBody DomainDtos.HomeRequest request) { return homes.save(new Home(request.name(), request.region(), request.capacity())); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public Home update(@PathVariable String id, @RequestBody DomainDtos.HomeRequest request) { Home home = homes.findById(id).orElseThrow(); home.update(request.name(), request.region(), request.capacity()); return homes.save(home); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public void delete(@PathVariable String id) { homes.deleteById(id); }
}