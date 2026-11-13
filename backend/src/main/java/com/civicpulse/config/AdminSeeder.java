package com.civicpulse.config;

import com.civicpulse.entity.User;
import com.civicpulse.entity.enums.Role;
import com.civicpulse.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the initial admin account from environment variables.
 *
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in the deployment environment.
 * No default credentials exist: when either variable is unset, no admin
 * account is created and registration stays citizen-only. The password is
 * never logged and never stored in the repository.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            log.warn("ADMIN_EMAIL/ADMIN_PASSWORD not set - no admin account seeded.");
            return;
        }
        if (adminPassword.length() < 8) {
            log.error("ADMIN_PASSWORD must be at least 8 characters - no admin account seeded.");
            return;
        }
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin account already exists for {} - skipping seed.", adminEmail);
            return;
        }

        User admin = User.builder()
                .fullName("CivicPulse Admin")
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("Admin account seeded for {}.", adminEmail);
    }
}
