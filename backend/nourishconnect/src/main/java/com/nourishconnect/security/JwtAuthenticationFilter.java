package com.nourishconnect.security;

import com.nourishconnect.repository.UserAccountRepository;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwtService;

    private final UserAccountRepository users;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserAccountRepository users
    ) {

        this.jwtService = jwtService;
        this.users = users;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {


        // ======================================
        // IMPORTANT:
        // Do not process CORS preflight
        // ======================================

        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod()
        )) {

            chain.doFilter(request, response);

            return;
        }


        // ======================================
        // GET AUTHORIZATION HEADER
        // ======================================

        String header =
                request.getHeader("Authorization");


        // ======================================
        // CHECK BEARER TOKEN
        // ======================================

        if (
                header != null &&
                header.startsWith("Bearer ")
        ) {

            try {

                String token =
                        header.substring(7);


                String email =
                        jwtService.email(token);


                users.findByEmailIgnoreCase(email)
                        .ifPresent(user -> {

                            var authentication =
                                    new UsernamePasswordAuthenticationToken(

                                            user.getEmail(),

                                            null,

                                            List.of(
                                                    new SimpleGrantedAuthority(
                                                            "ROLE_" +
                                                            user.getRole().name()
                                                    )
                                            )
                                    );


                            SecurityContextHolder
                                    .getContext()
                                    .setAuthentication(
                                            authentication
                                    );
                        });


            } catch (
                    JwtException |
                    IllegalArgumentException ignored
            ) {

                SecurityContextHolder
                        .clearContext();
            }
        }


        // ======================================
        // CONTINUE REQUEST
        // ======================================

        chain.doFilter(
                request,
                response
        );
    }
}