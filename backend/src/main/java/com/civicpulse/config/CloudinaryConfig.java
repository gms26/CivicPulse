package com.civicpulse.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        String cloudName = System.getenv("CLOUDINARY_CLOUD_NAME");
        String apiKey = System.getenv("CLOUDINARY_API_KEY");
        String apiSecret = System.getenv("CLOUDINARY_API_SECRET");

        log.info("Cloudinary init - cloudName present: {}",
            cloudName != null && !cloudName.isEmpty());
        log.info("Cloudinary init - apiKey present: {}",
            apiKey != null && !apiKey.isEmpty());

        if (cloudName == null || cloudName.isEmpty()) {
            throw new IllegalStateException(
                "CLOUDINARY_CLOUD_NAME env var is not set!");
        }

        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }
}
