package com.example.freshmart_user.service;

import com.example.freshmart_user.entity.Payment;
import com.example.freshmart_user.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    public PaymentRepository paymentRepository;

    @Autowired
    public JdbcTemplate jdbcTemplate;

    public Payment createPayment(Payment payment) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_payment(?, ?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setInt(1, payment.getOrder_id());
            cs.setInt(2, payment.getUser_id());
            cs.setInt(3, payment.getAmount());

            // Convert java.util.Date or LocalDate to java.sql.Date
            java.sql.Date sqlDate = new java.sql.Date(payment.getPaid_date().getTime());
            cs.setDate(4, sqlDate);

            // 3. Register output parameter for payment_id
            cs.registerOutParameter(5, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Get the generated payment_id
            int generatedPaymentId = cs.getInt(5);
            payment.setPay_id(generatedPaymentId);

            return payment;
        });
    }


    // Update payment
    public Payment updatePayment(int pay_id, Payment payment) {
        jdbcTemplate.update("CALL update_payment(?, ?, ?, ?, ?)",
                pay_id,
                payment.getOrder_id(),
                payment.getUser_id(),
                payment.getAmount(),
                payment.getPaid_date());
        return payment;
    }

    // Delete payment
    public String deletePayment(int pay_id) {
        jdbcTemplate.update("CALL delete_payment(?)", pay_id);
        return "Payment deletion successful";
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_all_payments(?)}");
            cs.registerOutParameter(1, Types.REF_CURSOR);
            cs.execute();

            try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                List<Payment> payments = new ArrayList<>();
                while (rs.next()) {
                    Payment payment = new Payment();
                    payment.setPay_id(rs.getInt("pay_id"));
                    payment.setOrder_id(rs.getInt("order_id"));
                    payment.setUser_id(rs.getInt("user_id"));
                    payment.setAmount(rs.getInt("amount"));
                    payment.setPaid_date(rs.getDate("paid_date"));
                    payments.add(payment);
                }
                return payments;
            }
        });
    }

    // Get payment by ID
    public Payment getPaymentById(int pay_id) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_payment_by_id(?, ?, ?, ?, ?)}");
            cs.setInt(1, pay_id);

            cs.registerOutParameter(2, Types.INTEGER);
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.DOUBLE);
            cs.registerOutParameter(5, Types.DATE);

            cs.execute();

            Payment payment = new Payment();
            payment.setPay_id(pay_id);
            payment.setOrder_id(cs.getInt(2));
            payment.setUser_id(cs.getInt(3));
            payment.setAmount(cs.getInt(4));
            payment.setPaid_date(cs.getDate(5));

            return payment;
        });
    }


    // Get payments by user_id
    public List<Payment> getPaymentsByUserId(int user_id) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_payments_by_user_id(?, ?)}");
            cs.setInt(1, user_id);
            cs.registerOutParameter(2, Types.REF_CURSOR);
            cs.execute();

            ResultSet rs = (ResultSet) cs.getObject(2);
            List<Payment> payments = new ArrayList<>();

            while (rs.next()) {
                Payment payment = new Payment();
                payment.setPay_id(rs.getInt("pay_id"));
                payment.setOrder_id(rs.getInt("order_id"));
                payment.setUser_id(rs.getInt("user_id"));
                payment.setAmount(rs.getInt("amount"));
                payment.setPaid_date(rs.getDate("paid_date"));

                payments.add(payment);
            }
            return payments;
        });
    }
}
