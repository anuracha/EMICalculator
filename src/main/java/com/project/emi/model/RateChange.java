package com.project.emi.model;

public class RateChange {
    private String startDate;
    private String endDate;
    private double newRate;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public double getNewRate() {
        return newRate;
    }

    public void setNewRate(double newRate) {
        this.newRate = newRate;
    }
}
