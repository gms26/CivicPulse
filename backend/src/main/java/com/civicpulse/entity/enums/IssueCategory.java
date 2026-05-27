package com.civicpulse.entity.enums;

public enum IssueCategory {
    ROAD("Broken Road"),
    WATER("Water Leak"),
    POWER("Power Outage"),
    GARBAGE("Garbage Overflow"),
    OTHER("Other");

    private final String displayName;

    IssueCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
