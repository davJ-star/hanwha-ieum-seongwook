package com.example.demo.Enum;

public enum DosageUnit {
    MG("mg"),
    MCG("mcg"),
    G("g"),
    ML("ml"),
    PERCENT("%");

    private final String label;

    DosageUnit(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}