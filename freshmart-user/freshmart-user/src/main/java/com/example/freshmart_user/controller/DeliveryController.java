package com.example.freshmart_user.controller;


import com.example.freshmart_user.entity.Delivery;
import com.example.freshmart_user.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class DeliveryController {

    @Autowired
    public DeliveryService deliveryService;

    // Create delivery
    @PostMapping(path = "deliveries")
    public Delivery createDelivery(@RequestBody Delivery delivery) {
        return deliveryService.createDelivery(delivery);
    }

    // Update delivery
    @PutMapping(path = "deliveries/{delivery_id}")
    public Delivery updateDelivery(@PathVariable int delivery_id, @RequestBody Delivery delivery) {
        return deliveryService.updateDelivery(delivery_id, delivery);
    }

    // Delete delivery
    @DeleteMapping(path = "deliveries/{delivery_id}")
    public String deleteDelivery(@PathVariable int delivery_id) {
        return deliveryService.deleteDelivery(delivery_id);
    }

    // Get all deliveries
    @GetMapping(path = "deliveries")
    public List<Delivery> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    // Get delivery by ID
    @GetMapping(path = "deliveries/{delivery_id}")
    public Delivery getDeliveryById(@PathVariable int delivery_id) {
        return deliveryService.getDeliveryById(delivery_id);
    }

    // Get deliveries by user_id
    @GetMapping(path = "deliveries/users/{user_id}")
    public List<Delivery> getDeliveriesByUserId(@PathVariable int user_id) {
        return deliveryService.getDeliveriesByUserId(user_id);
    }
}
