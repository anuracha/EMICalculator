package com.project.emi.model;

import java.util.List;

public class EmiRequest {
    private String startDate;
    private double principal;
    private double annualInterestRate;
    private int tenureInMonths;
    private List<Prepayment> prepayments;
    private List<RateChange> rateChanges;
    private double monthlyPrepayment;
    private String monthlyPrepayStartDate;
    private String monthlyPrepayEndDate;

    public double getMonthlyPrepayment() {
        return monthlyPrepayment;
    }

    public void setMonthlyPrepayment(double monthlyPrepayment) {
        this.monthlyPrepayment = monthlyPrepayment;
    }

    public String getMonthlyPrepayStartDate() {
        return monthlyPrepayStartDate;
    }

    public void setMonthlyPrepayStartDate(String monthlyPrepayStartDate) {
        this.monthlyPrepayStartDate = monthlyPrepayStartDate;
    }

    public String getMonthlyPrepayEndDate() {
        return monthlyPrepayEndDate;
    }

    public void setMonthlyPrepayEndDate(String monthlyPrepayEndDate) {
        this.monthlyPrepayEndDate = monthlyPrepayEndDate;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public double getPrincipal() {
        return principal;
    }

    public void setPrincipal(double principal) {
        this.principal = principal;
    }

    public double getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(double annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public int getTenureInMonths() {
        return tenureInMonths;
    }

    public void setTenureInMonths(int tenureInMonths) {
        this.tenureInMonths = tenureInMonths;
    }

    public List<Prepayment> getPrepayments() {
        return prepayments;
    }

    public void setPrepayments(List<Prepayment> prepayments) {
        this.prepayments = prepayments;
    }

    public List<RateChange> getRateChanges() {
        return rateChanges;
    }

    public void setRateChanges(List<RateChange> rateChanges) {
        this.rateChanges = rateChanges;
    }
}
