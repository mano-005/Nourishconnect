package com.nourishconnect.config;

import com.nourishconnect.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {


    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter
    ) throws Exception {

        return http

                // Disable CSRF because this is a REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> {
                })

                // JWT authentication = stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==================================
                // AUTHORIZATION
                // ==================================

                .authorizeHttpRequests(auth -> auth

                        // IMPORTANT:
                        // Allow browser CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Authentication APIs
                        .requestMatchers(
                                "/api/auth/**",
                                "/error"
                        ).permitAll()

                        // Homes
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/homes"
                        ).authenticated()

                        // Admin APIs
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Other APIs
                        .requestMatchers(
                                "/api/**"
                        ).authenticated()

                        // Everything else
                        .anyRequest().permitAll()
                )

                // JWT filter
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }


    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config =
                new CorsConfiguration();


        // ======================================
        // ALLOWED FRONTEND DOMAINS
        // ======================================

        config.setAllowedOrigins(
                List.of(

                        // Main Vercel domain
                        "https://nourishconnect-phcg.vercel.app",

                        // Current Vercel preview/project domain
                        "https://nourishconnect-phcg-mano-005s-projects.vercel.app"

                )
        );


        // ======================================
        // ALLOWED METHODS
        // ======================================

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        // ======================================
        // ALLOWED HEADERS
        // ======================================

        config.setAllowedHeaders(
                List.of("*")
        );


        // ======================================
        // CREDENTIALS
        // ======================================

        config.setAllowCredentials(false);


        // ======================================
        // REGISTER CORS
        // ======================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }
}