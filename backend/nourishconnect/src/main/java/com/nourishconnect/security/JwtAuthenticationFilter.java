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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserAccountRepository users;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserAccountRepository users) {

        this.jwtService = jwtService;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        // IMPORTANT:
        // Do not process JWT for CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            try {

                String email = jwtService.email(
                        header.substring(7)
                );

                users.findByEmailIgnoreCase(email).ifPresent(user -> {

                    var auth =
                            new UsernamePasswordAuthenticationToken(
                                    user.getEmail(),
                                    null,
                                    java.util.List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" +
                                                    user.getRole().name()
                                            )
                                    )
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(auth);
                });

            } catch (JwtException | IllegalArgumentException ignored) {

                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }
}