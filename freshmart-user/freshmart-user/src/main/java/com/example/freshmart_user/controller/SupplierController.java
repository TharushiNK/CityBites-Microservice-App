package com.example.freshmart_user.controller;

import com.example.freshmart_user.entity.Product;
import com.example.freshmart_user.entity.Supplier;
import com.example.freshmart_user.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class SupplierController {

    @Autowired
    public SupplierService supplierService;


    @PostMapping(path = "suppliers")
    public Supplier createSupplier(@RequestBody Supplier supplier){
        return supplierService.createSupplier(supplier);
    }

    @PutMapping(path = "suppliers/{sup_id}")
    public Supplier updateSupplier(@PathVariable int sup_id,@RequestBody Supplier supplier){
        return supplierService.updateSupplier(sup_id, supplier);
    }

    @DeleteMapping(path = "suppliers/{sup_id}")
    public String deleteSupplier(@PathVariable int sup_id){
        return supplierService.deleteSupplier(sup_id);
    }

    @GetMapping(path = "suppliers")
    public List<Supplier> getAllSuppliers(){
        return supplierService.getAllSuppliers();
    }

    @GetMapping(path = "suppliers/{sup_id}")
    public Supplier getSupplierById(@PathVariable int sup_id){
        return supplierService.getSupplierById(sup_id);
    }

    //supplier login
    @PostMapping(path ="suppliers/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String sup_email = credentials.get("sup_email");
        String sup_password = credentials.get("sup_password");

        // Call the service to check the credentials
        Map<String, Object> supplierDetails = supplierService.checkSupplierCredentials(sup_email, sup_password);

        if (supplierDetails != null) {
            return ResponseEntity.ok(supplierDetails);  // Return supplier details if valid
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

}
