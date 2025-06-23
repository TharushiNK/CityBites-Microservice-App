package com.example.freshmart_user.service;


import com.example.freshmart_user.entity.Product;

import com.example.freshmart_user.repository.ProductRepository;

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
public class ProductService {

    @Autowired
    public ProductRepository productRepository;
    @Autowired
    public JdbcTemplate jdbcTemplate;

    //create new product
    public Product createProduct(Product product) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_product(?, ?, ?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setString(1, product.getDescription());
            cs.setInt(2, product.getPer_price());
            cs.setInt(3, product.getQuantity());
            cs.setInt(4, product.getSup_id());
            cs.setInt(5, product.getRemaining());

            // 3. Register output parameter for product_id
            cs.registerOutParameter(6, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Retrieve the generated product_id
            int generatedProductId = cs.getInt(6);
            product.setProduct_id(generatedProductId);

            return product;
        });
    }


    //update product
    public Product updateProduct(int product_id, Product product) {
        jdbcTemplate.update("CALL update_product(?,?,?,?,?,?)",
                product_id,
                product.getDescription(),
                product.getPer_price(),
                product.getQuantity(),
                product.getSup_id(),
                product.getRemaining());
        return product;
    }

    //delete product
    public String deleteProduct(int product_id) {
        jdbcTemplate.update("CALL delete_product(?)",
                product_id);
        return "product deletion successful";
    }

    //get all the product details

    public List<Product> getAllProducts() {
        // Simple call to PL/SQL procedure
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    CallableStatement cs = conn.prepareCall("{CALL get_all_products(?)}");
                    cs.registerOutParameter(1, Types.REF_CURSOR);
                    cs.execute();

                    // Auto-map results to Product objects
                    try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                        List<Product> products = new ArrayList<>();
                        while (rs.next()) {
                            Product product = new Product();
                            product.setProduct_id(rs.getInt("product_id"));
                            product.setDescription(rs.getString("description"));
                            product.setPer_price(rs.getInt("per_price"));
                            product.setQuantity(rs.getInt("quantity"));
                            product.setSup_id(rs.getInt("sup_id"));
                            product.setRemaining(rs.getInt("remaining"));
                            products.add(product);
                        }
                        return products;
                    }
                }
        );
    }

    //get product by id
    public Product getProductById(int product_id) {
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    // Prepare the call with OUT parameters
                    CallableStatement cs = conn.prepareCall(
                            "{CALL get_product_by_id(?, ?, ?, ?, ?,?)}"
                    );

                    // Set IN parameter
                    cs.setInt(1, product_id);

                    // Register OUT parameters
                    cs.registerOutParameter(2, Types.VARCHAR);  // p_description
                    cs.registerOutParameter(3, Types.INTEGER);  // p_per_price
                    cs.registerOutParameter(4, Types.INTEGER);  // p_quantity
                    cs.registerOutParameter(5, Types.INTEGER);  // p_sup_id
                    cs.registerOutParameter(6, Types.INTEGER); //remaining

                    cs.execute();

                    // Create and populate product object
                    Product product = new Product();
                    product.setProduct_id(product_id);  // Set the ID we searched for
                    product.setDescription(cs.getString(2));
                    product.setPer_price(cs.getInt(3));
                    product.setQuantity(cs.getInt(4));
                    product.setSup_id(cs.getInt(5));
                    product.setRemaining(cs.getInt(6));

                    return product;
                }
        );
    }

}
