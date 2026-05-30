package com.civicpulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IssueCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;  // Will be parsed to IssueCategory enum

    @Size(max = 500, message = "Location address must not exceed 500 characters")
    private String locationAddress;

    private Double latitude;

    private Double longitude;

    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================

    public IssueCreateRequest() {}

    public IssueCreateRequest(String title, String description, String category, String locationAddress, Double latitude, Double longitude) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public static IssueCreateRequestBuilder builder() {
        return new IssueCreateRequestBuilder();
    }

    public static class IssueCreateRequestBuilder {
        private String title;
        private String description;
        private String category;
        private String locationAddress;
        private Double latitude;
        private Double longitude;

        public IssueCreateRequestBuilder title(String title) {
            this.title = title;
            return this;
        }

        public IssueCreateRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public IssueCreateRequestBuilder category(String category) {
            this.category = category;
            return this;
        }

        public IssueCreateRequestBuilder locationAddress(String locationAddress) {
            this.locationAddress = locationAddress;
            return this;
        }

        public IssueCreateRequestBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public IssueCreateRequestBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public IssueCreateRequest build() {
            return new IssueCreateRequest(title, description, category, locationAddress, latitude, longitude);
        }
    }
}
