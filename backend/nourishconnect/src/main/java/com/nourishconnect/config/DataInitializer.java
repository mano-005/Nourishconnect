package com.nourishconnect.config;

import com.nourishconnect.entity.Home;
import com.nourishconnect.entity.UserAccount;
import com.nourishconnect.repository.HomeRepository;
import com.nourishconnect.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seed(UserAccountRepository users, HomeRepository homes, PasswordEncoder encoder,
                           @Value("${nourishconnect.admin.email}") String email, @Value("${nourishconnect.admin.password}") String password) {
        return args -> {
            if (users.findByEmailIgnoreCase(email).isEmpty()) users.save(new UserAccount(email, encoder.encode(password), "Administrator", UserAccount.Role.ADMIN));
            if (homes.count() == 0) {
                homes.save(new Home("Maple Street Pantry", "North district", 82)); homes.save(new Home("Cedar Grove Home", "East district", 54));
                homes.save(new Home("Riverside Shelter", "South district", 91)); homes.save(new Home("Sunshine Orphanage", "West district", 63));
                homes.save(new Home("Downtown Shelter", "Central district", 47)); homes.save(new Home("Community Kitchen West", "West district", 76));
            }
        };
    }
}