package com.example.freshmart_user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private int sup_id;

    @Column(name = "sup_name")
    private String sup_name;

    @Column(name = "sup_email")
    private String sup_email;

    @Column(name = "sup_password")
    private String sup_password;



    public Supplier(int sup_id, String sup_name, String sup_email, String sup_password) {
        this.sup_id = sup_id;
        this.sup_name = sup_name;
        this.sup_email = sup_email;
        this.sup_password = sup_password;

    }

    public Supplier() {

    }

    public int getSup_id() {
        return sup_id;
    }

    public void setSup_id(int sup_id) {
        this.sup_id = sup_id;
    }

    public String getSup_name() {
        return sup_name;
    }

    public void setSup_name(String sup_name) {
        this.sup_name = sup_name;
    }

    public String getSup_email() {
        return sup_email;
    }

    public void setSup_email(String sup_email) {
        this.sup_email = sup_email;
    }

    public String getSup_password() {
        return sup_password;
    }

    public void setSup_password(String sup_password) {
        this.sup_password = sup_password;
    }


}
