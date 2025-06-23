package com.urbanfood.customerreviewservice.repository;

import com.urbanfood.customerreviewservice.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, Integer> {
    @Query("{ 'productId' : ?0 }")
    List<Review> findByProductId(int productId);
}
