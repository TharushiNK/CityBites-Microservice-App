package com.example.freshmart_user.service;


import com.example.freshmart_user.entity.Order;
import com.example.freshmart_user.repository.OrderRepository;
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
public class OrderService {

    @Autowired
    public OrderRepository orderRepository;

    @Autowired
    public JdbcTemplate jdbcTemplate;

    //create Order
    public Order createOrder(Order order) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_order(?, ?, ?, ?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setInt(1, order.getProduct_id());
            cs.setInt(2, order.getTotal());
            cs.setInt(3, order.getDiscounted_amount());
            cs.setInt(4, order.getFinal_amount());
            cs.setInt(5, order.getOrder_amount());
            cs.setInt(6, order.getUser_id());

            // 3. Register output parameter for order_id
            cs.registerOutParameter(7, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Get the generated order_id
            int generatedOrderId = cs.getInt(7);
            order.setOrder_id(generatedOrderId);

            return order;
        });
    }

    //update order
    public Order updateOrder(int order_id, Order order) {
        jdbcTemplate.update("CALL update_order(?,?,?,?,?,?,?)",
                order_id,
                order.getProduct_id(),
                order.getTotal(),
                order.getDiscounted_amount(),
                order.getFinal_amount(),
                order.getOrder_amount(),
                order.getUser_id());
        return order;
    }

    //delete order
    public String deleteOrder(int order_id) {
        jdbcTemplate.update("CALL delete_order(?)",
                order_id);
        return "order deletion successful";
    }

    //get all the  orders as a list
    public List<Order> getAllOrders() {
        // Simple call to PL/SQL procedure
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    CallableStatement cs = conn.prepareCall("{CALL get_all_orders(?)}");
                    cs.registerOutParameter(1, Types.REF_CURSOR);
                    cs.execute();

                    // Auto-map results to Product objects
                    try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                        List<Order> orders = new ArrayList<>();
                        while (rs.next()) {
                            Order order = new Order();
                            order.setOrder_id(rs.getInt("order_id"));
                            order.setProduct_id(rs.getInt("product_id"));
                            order.setTotal(rs.getInt("total"));
                            order.setDiscounted_amount(rs.getInt("discounted_amount"));
                            order.setFinal_amount(rs.getInt("final_amount"));
                            order.setOrder_amount(rs.getInt("order_amount"));
                            order.setUser_id(rs.getInt("user_id"));
                            orders.add(order);
                        }
                        return orders;
                    }
                }
        );
    }

    //get orders by id
    public Order getOrderById(int order_id) {
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    CallableStatement cs = conn.prepareCall(
                            "{CALL get_order_by_id(?, ?, ?, ?, ?, ?, ?)}"
                    );
                    cs.setInt(1, order_id);
                    cs.registerOutParameter(2, Types.INTEGER);
                    cs.registerOutParameter(3, Types.INTEGER);
                    cs.registerOutParameter(4, Types.INTEGER);
                    cs.registerOutParameter(5, Types.INTEGER);
                    cs.registerOutParameter(6, Types.INTEGER);
                    cs.registerOutParameter(7, Types.INTEGER);
                    cs.execute();

                    Order order = new Order();
                    order.setOrder_id(order_id);
                    order.setProduct_id(cs.getInt(2));
                    order.setTotal(cs.getInt(3));
                    order.setDiscounted_amount(cs.getInt(4));
                    order.setFinal_amount(cs.getInt(5));
                    order.setOrder_amount(cs.getInt(6));
                    order.setUser_id(cs.getInt(7));

                    return order;
                }
        );
    }



    // Create Order with PL/SQL Calculation
    public Order calculateOrder(Order order) {
        return jdbcTemplate.execute((Connection conn) -> {
            // Step 1: Fetch per_price from the product table
            String priceQuery = "SELECT per_price FROM product WHERE product_id = ?";
            int perPrice = jdbcTemplate.queryForObject(priceQuery, Integer.class, order.getProduct_id());

            // Step 2: Call PL/SQL procedure to calculate values
            CallableStatement cs = conn.prepareCall("{CALL calculate_order_values(?, ?, ?, ?, ?)}");

            // Set input parameters
            cs.setInt(1, order.getOrder_amount());
            cs.setInt(2, perPrice);

            // Register output parameters
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.INTEGER);
            cs.registerOutParameter(5, Types.INTEGER);

            // Execute the stored procedure
            cs.execute();

            // Step 3: Set the calculated values in the order object
            order.setTotal(cs.getInt(3));
            order.setDiscounted_amount(cs.getInt(4));
            order.setFinal_amount(cs.getInt(5));



            return order;
        });
    }

    //get orders by user id
    public List<Order> getOrdersByUserId(int user_id) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{CALL get_orders_by_user_id(?, ?)}");
            cs.setInt(1, user_id);
            cs.registerOutParameter(2, Types.REF_CURSOR);
            cs.execute();

            ResultSet rs = (ResultSet) cs.getObject(2);
            List<Order> orders = new ArrayList<>();

            while (rs.next()) {
                Order order = new Order();
                order.setOrder_id(rs.getInt("order_id"));
                order.setProduct_id(rs.getInt("product_id"));
                order.setTotal(rs.getInt("total"));
                order.setDiscounted_amount(rs.getInt("discounted_amount"));
                order.setFinal_amount(rs.getInt("final_amount"));
                order.setOrder_amount(rs.getInt("order_amount"));
                order.setUser_id(rs.getInt("user_id"));

                orders.add(order);
            }
            return orders;
        });
    }

}
