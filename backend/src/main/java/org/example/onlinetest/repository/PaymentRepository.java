package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Payment;
import org.example.onlinetest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    void  deleteAllByUser(User user);
}
