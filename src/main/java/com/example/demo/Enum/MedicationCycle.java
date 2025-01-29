package com.example.demo.Enum;

public enum MedicationCycle {
    DAILY("매일"),
    WEEKLY("매주");

    private final String description;

    MedicationCycle(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
