package com.example.freshmart_user.repository;

import com.example.freshmart_user.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PaymentRepository extends JpaRepository<Payment,Integer> {
}
