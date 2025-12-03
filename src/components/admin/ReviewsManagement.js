import { useState, useEffect } from "react";
import "./ReviewsManagement.css";

function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    review: ""
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    if (storedReviews.length === 0) {
      // Initialize with default reviews
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
      localStorage.setItem("reviews", JSON.stringify(defaultReviews));
    } else {
      setReviews(storedReviews);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      ...formData
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setFormData({ name: "", review: "" });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const updatedReviews = reviews.filter(review => review.id !== id);
      setReviews(updatedReviews);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    }
  };

  return (
    <div className="reviews-management">
      <div className="reviews-header">
        <h1>Reviews Management</h1>
        <button
          className="add-review-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {isAdding && (
        <div className="review-form-container">
          <h2>Add New Review</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label>Review</label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Enter review text..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Add Review
            </button>
          </form>
        </div>
      )}

      <div className="reviews-list">
        <h2>All Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card-admin">
                <div className="review-header">
                  <h3>{review.name}</h3>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                </div>
                <p className="review-text">"{review.review}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsManagement;

