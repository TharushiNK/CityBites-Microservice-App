package com.example.freshmart_user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ORDERS")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_id;

    @Column(name = "product_id")
    private int product_id;

    @Column(name = "total")
    private int total;

    @Column(name = "discounted_amount")
    private int discounted_amount;

    @Column(name = "final_amount")
    private int final_amount;

    @Column(name = "order_amount")
    private int order_amount;

    @Column(name = "user_id")
    private int user_id;

    public Order() {
    }

    public Order(int order_id, int product_id, int total, int discounted_amount, int final_amount,int order_amount, int user_id) {
        this.order_id = order_id;
        this.product_id = product_id;
        this.total = total;
        this.discounted_amount = discounted_amount;
        this.final_amount = final_amount;
        this.order_amount = order_amount;
        this.user_id = user_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getDiscounted_amount() {
        return discounted_amount;
    }

    public void setDiscounted_amount(int discounted_amount) {
        this.discounted_amount = discounted_amount;
    }

    public int getFinal_amount() {
        return final_amount;
    }

    public void setFinal_amount(int final_amount) {
        this.final_amount = final_amount;
    }

    public int getOrder_amount() {
        return order_amount;
    }

    public void setOrder_amount(int order_amount) {
        this.order_amount = order_amount;
    }
}
