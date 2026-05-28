package com.civicpulse.service;

import com.civicpulse.dto.request.LoginRequest;
import com.civicpulse.dto.request.RegisterRequest;
import com.civicpulse.dto.response.AuthResponse;
import com.civicpulse.entity.User;
import com.civicpulse.entity.enums.Role;
import com.civicpulse.exception.BadRequestException;
import com.civicpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ==================== UserDetailsService ====================

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // ==================== Registration ====================

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            log.info("Registration attempt for email: {}", request.getEmail());

            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                log.warn("Registration failed: email already exists - {}", request.getEmail());
                throw new BadRequestException("An account with this email already exists");
            }

            // Build and save the new user (always as CITIZEN — admins are seeded via data.sql)
            User user = User.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(Role.CITIZEN)
                    .phone(request.getPhone())
                    .build();

            user = userRepository.save(user);
            log.info("User registered successfully: {} (ID: {})", user.getEmail(), user.getId());

            // Generate JWT token
            String token = jwtService.generateToken(user);

            return AuthResponse.builder()
                    .token(token)
                    .role(user.getRole().name())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .build();
        } catch (BadRequestException e) {
            throw e; // Re-throw known exceptions
        } catch (Exception e) {
            log.error("Registration failed for email {}: {}", request.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    // ==================== Login ====================

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
