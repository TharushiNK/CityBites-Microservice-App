package com.example.freshmart_user.controller;


import com.example.freshmart_user.entity.Product;
import com.example.freshmart_user.entity.User;
import com.example.freshmart_user.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ProductController {

    @Autowired
    public ProductService productService;

    @PostMapping(path = "products")
    public Product createProduct(@RequestBody Product product){
        return productService.createProduct(product);
    }

    @PutMapping(path = "products/{product_id}")
    public Product updateProduct(@PathVariable int product_id,@RequestBody Product product){
        return productService.updateProduct(product_id, product);
    }

    @DeleteMapping(path = "products/{product_id}")
    public String deleteProduct(@PathVariable int product_id){
        return productService.deleteProduct(product_id);
    }

    @GetMapping(path = "products")
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping(path = "products/{product_id}")
    public Product getProductById(@PathVariable int product_id){
        return productService.getProductById(product_id);
    }
}
