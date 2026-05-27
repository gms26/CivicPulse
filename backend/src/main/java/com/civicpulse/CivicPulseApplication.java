package com.civicpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CivicPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicPulseApplication.class, args);
    }

    @Bean
    public CommandLineRunner printHash(PasswordEncoder encoder) {
        return args -> {
            System.out.println("==================================================");
            System.out.println("HASH_FOR_ADMIN: " + encoder.encode("Admin@123"));
            System.out.println("==================================================");
        };
    }
}
