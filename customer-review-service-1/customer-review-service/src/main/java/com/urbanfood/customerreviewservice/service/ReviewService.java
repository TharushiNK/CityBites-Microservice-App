package com.urbanfood.customerreviewservice.service;

import com.urbanfood.customerreviewservice.model.Review;
import com.urbanfood.customerreviewservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviews(int productId) {
        // This will return a list of reviews for a given productId
        return reviewRepository.findByProductId(productId);  // Assuming this method returns a List<Review>
    }


    public void deleteReview(int id) {
        reviewRepository.deleteById(id);
    }
}
