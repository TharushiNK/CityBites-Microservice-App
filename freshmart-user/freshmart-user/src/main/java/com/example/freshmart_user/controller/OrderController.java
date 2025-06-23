package com.example.freshmart_user.controller;


import com.example.freshmart_user.entity.Order;
import com.example.freshmart_user.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class OrderController {

    @Autowired
    public OrderService orderService;
    @PostMapping(path = "orders")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);

        return ResponseEntity.ok(Map.of(
                "order_id", createdOrder.getOrder_id(), // Explicitly include order_id
                "order", createdOrder // Include full order object if needed
        ));
    // Ensure the saved order with ID is returned
    }
    @PutMapping(path = "orders/{order_id}")
    public Order updateOrder(@PathVariable int order_id,@RequestBody Order order){
        return orderService.updateOrder(order_id, order);
    }

    @DeleteMapping(path = "orders/{order_id}")
    public String deleteOrder(@PathVariable int order_id){
        return orderService.deleteOrder(order_id);
    }

    @GetMapping(path = "orders")
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping(path = "orders/{order_id}")
    public Order getOrderById(@PathVariable int order_id){
        return orderService.getOrderById(order_id);
    }

    @PostMapping(path = "orders/calculation")
    public Order calculateOrder(@RequestBody Order order) {
        return orderService.calculateOrder(order);
    }

    // Get all orders by user_id
    @GetMapping(path = "orders/users/{user_id}")
    public List<Order> getOrdersByUserId(@PathVariable int user_id) {
        return orderService.getOrdersByUserId(user_id);
    }
}


