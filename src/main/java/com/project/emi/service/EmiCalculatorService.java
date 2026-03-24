package com.project.emi.service;

import com.project.emi.model.EmiRequest;
import com.project.emi.model.EmiResponse;
import com.project.emi.model.Prepayment;
import com.project.emi.model.RateChange;
import com.project.emi.model.ScheduleRow;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmiCalculatorService {

    public EmiResponse calculateEmi(EmiRequest request) {
        double balance = request.getPrincipal();
        double rate = request.getAnnualInterestRate();
        int originalTenure = request.getTenureInMonths();

        LocalDate startDate = LocalDate.now();
        if (request.getStartDate() != null && !request.getStartDate().isEmpty()) {
            startDate = LocalDate.parse(request.getStartDate(), DateTimeFormatter.ISO_LOCAL_DATE);
        }

        double currentEmi = calculateStandardEmi(balance, rate, originalTenure);
        double totalInterest = 0;
        double totalPayment = 0;
        List<ScheduleRow> schedule = new ArrayList<>();

        DateTimeFormatter outFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        int m = 1;
        while (balance > 0.001) {
            LocalDate currentEmiDate = startDate.plusMonths(m);
            LocalDate previousEmiDate = startDate.plusMonths(m - 1);

            // 1. Check Rate changes
            if (request.getRateChanges() != null) {
                for (RateChange rc : request.getRateChanges()) {
                    LocalDate rcDate = LocalDate.parse(rc.getDate(), DateTimeFormatter.ISO_LOCAL_DATE);
                    boolean isMatched = false;
                    if (m == 1) {
                        isMatched = !rcDate.isBefore(previousEmiDate) && !rcDate.isAfter(currentEmiDate);
                    } else {
                        isMatched = rcDate.isAfter(previousEmiDate) && !rcDate.isAfter(currentEmiDate);
                    }
                    if (isMatched) {
                        rate = rc.getNewRate();
                    }
                }
            }

            double monthlyRate = rate / 12 / 100;
            double interestComponent = balance * monthlyRate;
            double principalComponent = currentEmi - interestComponent;

            // Handle last month or if balance is smaller than principal component
            if (balance < principalComponent) {
                principalComponent = balance;
                currentEmi = principalComponent + interestComponent;
            }

            balance -= principalComponent;
            totalInterest += interestComponent;
            totalPayment += currentEmi;

            // 2. Add prepayments that occurred in this cycle
            double prepaymentAmount = 0;
            if (request.getPrepayments() != null) {
                for (Prepayment p : request.getPrepayments()) {
                    LocalDate pDate = LocalDate.parse(p.getDate(), DateTimeFormatter.ISO_LOCAL_DATE);
                    boolean isMatched = false;
                    if (m == 1) {
                        isMatched = !pDate.isBefore(previousEmiDate) && !pDate.isAfter(currentEmiDate);
                    } else {
                        isMatched = pDate.isAfter(previousEmiDate) && !pDate.isAfter(currentEmiDate);
                    }
                    if (isMatched) {
                        double amount = p.getAmount();
                        prepaymentAmount += amount;
                    }
                }
            }

            if (prepaymentAmount > 0) {
                if (prepaymentAmount > balance) {
                    prepaymentAmount = balance;
                }
                balance -= prepaymentAmount;
                totalPayment += prepaymentAmount;
            }

            ScheduleRow row = new ScheduleRow();
            row.setDate(currentEmiDate.format(outFormatter));
            row.setEmi(Math.round(currentEmi * 100.0) / 100.0);
            row.setInterest(Math.round(interestComponent * 100.0) / 100.0);
            row.setPrincipal(Math.round(principalComponent * 100.0) / 100.0);
            row.setPrepayment(Math.round(prepaymentAmount * 100.0) / 100.0);
            row.setRemainingBalance(Math.round(balance * 100.0) / 100.0);
            row.setInterestRate(rate);

            schedule.add(row);
            m++;

            // Failsafe mostly, should not happen unless data is bad
            if (m > originalTenure * 3) {
                break;
            }
        }

        EmiResponse response = new EmiResponse();
        response.setTotalInterest(Math.round(totalInterest * 100.0) / 100.0);
        response.setTotalPayment(Math.round(totalPayment * 100.0) / 100.0);
        response.setSchedule(schedule);

        return response;
    }

    private double calculateStandardEmi(double principal, double annualRate, int tenureInMonths) {
        if (annualRate == 0) {
            return principal / tenureInMonths;
        }
        double r = annualRate / 12 / 100.0;
        double emi = (principal * r * Math.pow(1 + r, tenureInMonths)) / (Math.pow(1 + r, tenureInMonths) - 1);
        return emi;
    }
}
