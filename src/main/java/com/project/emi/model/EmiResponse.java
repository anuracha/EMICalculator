package com.project.emi.model;

import java.util.List;

public class EmiResponse {
    private double totalInterest;
    private double totalPayment;
    private List<ScheduleRow> schedule;

    public double getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(double totalInterest) {
        this.totalInterest = totalInterest;
    }

    public double getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(double totalPayment) {
        this.totalPayment = totalPayment;
    }

    public List<ScheduleRow> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ScheduleRow> schedule) {
        this.schedule = schedule;
    }
}
