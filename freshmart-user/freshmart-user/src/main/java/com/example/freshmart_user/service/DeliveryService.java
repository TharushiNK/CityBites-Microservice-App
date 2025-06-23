package com.example.freshmart_user.service;


import com.example.freshmart_user.entity.Delivery;
import com.example.freshmart_user.repository.DeliveryRepository;
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
public class DeliveryService {

    @Autowired
    public DeliveryRepository deliveryRepository;

    @Autowired
    public JdbcTemplate jdbcTemplate;


    // Create delivery
    public Delivery createDelivery(Delivery delivery) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_delivery(?, ?, ?, ?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setInt(1, delivery.getOrder_id());
            cs.setInt(2, delivery.getUser_id());
            cs.setDate(3, new java.sql.Date(delivery.getDelivery_date().getTime()));  // Assuming delivery_date is a java.util.Date
            cs.setString(4, delivery.getDelivery_status());
            cs.setString(5, delivery.getDelivery_address());
            cs.setInt(6, delivery.getPay_id()); // Assuming pay_id is already set in the Delivery object

            // 3. Register output parameter for delivery_id (assuming it's an integer)
            cs.registerOutParameter(7, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Get the generated delivery_id
            int generatedDeliveryId = cs.getInt(7);
            delivery.setDelivery_id(generatedDeliveryId); // Set the generated delivery_id

            return delivery;
        });
    }

    // Update delivery
    public Delivery updateDelivery(int delivery_id, Delivery delivery) {
        jdbcTemplate.update("CALL update_delivery(?, ?, ?, ?, ?, ?)",
                delivery_id,
                delivery.getOrder_id(),
                delivery.getUser_id(),
                delivery.getDelivery_date(),
                delivery.getDelivery_status(),
                delivery.getDelivery_address());
        return delivery;
    }

    // Delete delivery
    public String deleteDelivery(int delivery_id) {
        jdbcTemplate.update("CALL delete_delivery(?)", delivery_id);
        return "Delivery deletion successful";
    }

    // Get all deliveries
    public List<Delivery> getAllDeliveries() {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_all_deliveries(?)}");
            cs.registerOutParameter(1, Types.REF_CURSOR);
            cs.execute();

            try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                List<Delivery> deliveries = new ArrayList<>();
                while (rs.next()) {
                    Delivery delivery = new Delivery();
                    delivery.setDelivery_id(rs.getInt("delivery_id"));
                    delivery.setOrder_id(rs.getInt("order_id"));
                    delivery.setUser_id(rs.getInt("user_id"));
                    delivery.setDelivery_date(rs.getDate("delivery_date"));
                    delivery.setDelivery_status(rs.getString("delivery_status"));
                    delivery.setDelivery_address(rs.getString("delivery_address"));
                    deliveries.add(delivery);
                }
                return deliveries;
            }
        });
    }

    // Get delivery by  ID
    public Delivery getDeliveryById(int delivery_id) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_delivery_by_id(?, ?, ?, ?, ?, ?)}");
            cs.setInt(1, delivery_id);

            cs.registerOutParameter(2, Types.INTEGER);  // order_id
            cs.registerOutParameter(3, Types.INTEGER);  // user_id
            cs.registerOutParameter(4, Types.DATE);     // delivery_date
            cs.registerOutParameter(5, Types.VARCHAR);  // delivery_status
            cs.registerOutParameter(6, Types.VARCHAR);  // delivery_address

            cs.execute();

            Delivery delivery = new Delivery();
            delivery.setDelivery_id(delivery_id);
            delivery.setOrder_id(cs.getInt(2));
            delivery.setUser_id(cs.getInt(3));
            delivery.setDelivery_date(cs.getDate(4));
            delivery.setDelivery_status(cs.getString(5));
            delivery.setDelivery_address(cs.getString(6));

            return delivery;
        });
    }


    // Get all deliveries by user_id
    public List<Delivery> getDeliveriesByUserId(int user_id) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_deliveries_by_user_id(?, ?)}");
            cs.setInt(1, user_id);
            cs.registerOutParameter(2, Types.REF_CURSOR);
            cs.execute();

            ResultSet rs = (ResultSet) cs.getObject(2);
            List<Delivery> deliveries = new ArrayList<>();

            while (rs.next()) {
                Delivery delivery = new Delivery();
                delivery.setDelivery_id(rs.getInt("delivery_id"));
                delivery.setOrder_id(rs.getInt("order_id"));
                delivery.setUser_id(rs.getInt("user_id"));
                delivery.setDelivery_date(rs.getDate("delivery_date"));
                delivery.setDelivery_status(rs.getString("delivery_status"));
                delivery.setDelivery_address(rs.getString("delivery_address"));
                delivery.setPay_id(rs.getInt("pay_id"));

                deliveries.add(delivery);
            }
            return deliveries;
        });
    }
}
