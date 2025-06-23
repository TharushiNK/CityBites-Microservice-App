package com.example.freshmart_user.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "DELIVERY")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int delivery_id;

    @Column(name = "order_id")
    private int order_id;

    @Column(name = "user_id")
    private int user_id;

    @Column(name = "delivery_date")
    private Date delivery_date;

    @Column(name = "delivery_status")
    private String delivery_status;

    @Column(name = "delivery_address")
    private String delivery_address;

    @Column(name = "pay_id")
    private int pay_id;

    public Delivery() {
    }

    public Delivery(int delivery_id, int order_id, int user_id, Date delivery_date, String delivery_status, String delivery_address,int pay_id)
    {this.delivery_id = delivery_id;
        this.order_id = order_id;
        this.user_id = user_id;
        this.delivery_date = delivery_date;
        this.delivery_status = delivery_status;
        this.delivery_address = delivery_address;
        this.pay_id = pay_id;
    }

    public int getPay_id() {
        return pay_id;
    }

    public void setPay_id(int pay_id) {
        this.pay_id = pay_id;
    }

    public int getDelivery_id() {
        return delivery_id;
    }

    public void setDelivery_id(int delivery_id) {
        this.delivery_id = delivery_id;
    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Date getDelivery_date() {
        return delivery_date;
    }

    public void setDelivery_date(Date delivery_date) {
        this.delivery_date = delivery_date;
    }

    public String getDelivery_status() {
        return delivery_status;
    }

    public void setDelivery_status(String delivery_status) {
        this.delivery_status = delivery_status;
    }

    public String getDelivery_address() {
        return delivery_address;
    }

    public void setDelivery_address(String delivery_address) {
        this.delivery_address = delivery_address;
    }
}
