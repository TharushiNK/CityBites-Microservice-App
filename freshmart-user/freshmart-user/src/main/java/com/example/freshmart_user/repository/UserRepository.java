package com.example.freshmart_user.repository;

import com.example.freshmart_user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    //JPQL for search user by their email
    @Query("select u from User u where u.email =?1")
    public Optional<User> findByEmail(String email);


}
