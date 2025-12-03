import React, { useState, useEffect } from "react";
import "./Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Load reviews from localStorage or use defaults
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    if (storedReviews.length > 0) {
      setReviews(storedReviews);
    } else {
      // Default reviews
      const defaultReviews = [
        {
          id: 1,
          name: "Priya Sharma",
          review: "Amazing spa experience. Very soothing and peaceful!"
        },
        {
          id: 2,
          name: "Rahul Verma",
          review: "Staff was super friendly. Loved the massage session!"
        },
        {
          id: 3,
          name: "Neha Patel",
          review: "Best relaxation spa in the city. Highly recommended."
        }
      ];
      setReviews(defaultReviews);
    }
  }, []);

  return (
    <div className="reviews-section" id="reviews">
      <h1>Client Reviews</h1>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.name}</h3>
            <p>"{review.review}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
