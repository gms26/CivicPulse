package com.civicpulse.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads an image to Cloudinary and returns the secure URL.
     * @param file the multipart file to upload
     * @return secure URL string
     * @throws IOException if upload fails
     */
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "civicpulse/issues",
                    "resource_type", "auto"
                )
            );
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    public String testConnection() {
        try {
            Map result = cloudinary.api().ping(ObjectUtils.emptyMap());
            return result.toString();
        } catch (Exception e) {
            log.error("Cloudinary ping failed: {}", e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }
}
