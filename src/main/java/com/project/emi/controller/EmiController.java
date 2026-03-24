package com.project.emi.controller;

import com.project.emi.model.EmiRequest;
import com.project.emi.model.EmiResponse;
import com.project.emi.service.EmiCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emi")
public class EmiController {

    private final EmiCalculatorService emiService;

    @Autowired
    public EmiController(EmiCalculatorService emiService) {
        this.emiService = emiService;
    }

    @RequestMapping(value = "/calculate", method = RequestMethod.POST)
    public EmiResponse calculateEmiSchedule(@RequestBody EmiRequest request) {
        return emiService.calculateEmi(request);
    }
}
