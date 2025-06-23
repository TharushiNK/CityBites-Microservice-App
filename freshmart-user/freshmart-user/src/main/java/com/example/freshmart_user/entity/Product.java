package com.example.freshmart_user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int product_id;

    @Column(name = "description")
    private String description;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "per_price")
    private int per_price;

    @Column(name = "sup_id")
    private int sup_id;


    @Column(name = "remaining")
    private int remaining;

    public Product(int product_id, String description, int quantity, int per_price, int sup_id,int remaining) {
        this.product_id = product_id;
        this.description = description;
        this.quantity = quantity;
        this.per_price = per_price;
        this.sup_id = sup_id;
        this.remaining = remaining;
    }

    public Product() {

    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPer_price() {
        return per_price;
    }

    public void setPer_price(int per_price) {
        this.per_price = per_price;
    }

    public int getSup_id() {
        return sup_id;
    }

    public void setSup_id(int sup_id) {
        this.sup_id = sup_id;
    }
    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }
}