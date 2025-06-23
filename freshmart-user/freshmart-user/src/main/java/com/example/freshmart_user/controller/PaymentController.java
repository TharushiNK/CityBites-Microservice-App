package com.example.freshmart_user.controller;

import com.example.freshmart_user.entity.Payment;
import com.example.freshmart_user.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class PaymentController {

    @Autowired
    public PaymentService paymentService;

    @PostMapping(path = "payments")
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @PutMapping(path ="payments/{pay_id}")
    public Payment updatePayment(@PathVariable int pay_id, @RequestBody Payment payment) {
        return paymentService.updatePayment(pay_id, payment);
    }

    @DeleteMapping(path = "payments/{pay_id}")
    public String deletePayment(@PathVariable int pay_id) {
        return paymentService.deletePayment(pay_id);
    }

    @GetMapping(path = "payments")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping(path = "payments/{pay_id}")
    public Payment getPaymentById(@PathVariable int pay_id) {
        return paymentService.getPaymentById(pay_id);
    }

    // Get all payments by user_id
    @GetMapping(path = "payments/users/{user_id}")
    public List<Payment> getPaymentsByUserId(@PathVariable int user_id) {
        return paymentService.getPaymentsByUserId(user_id);
    }
}
