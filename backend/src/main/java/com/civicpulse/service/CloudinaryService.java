package com.civicpulse.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.civicpulse.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads an image to Cloudinary and returns the secure URL.
     * Only image files are accepted; anything else is rejected before
     * it reaches Cloudinary. Upload failures propagate so the caller
     * can fail the request instead of silently dropping the photo.
     * @param file the multipart file to upload
     * @return secure URL string
     */
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed.");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "civicpulse/issues",
                    "resource_type", "image"
                )
            );
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }
}
