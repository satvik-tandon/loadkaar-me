import React, { useState, useEffect } from "react";
import "../styles/TaskReview.css"; // CSS for TaskReview component
import axios from "axios";
import { useSelector } from "react-redux";

const TaskReview = ({ type }) => {
  const { userID, role } = useSelector((state) => state.user || {});
  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(role);
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      let response;
      if (!userID) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      if (type === "Tasks Review") {
        response = await axios.post("/api/get-reviewbyreviewer", { user_id: userID ,role  });
      } else if (type === "Received Review") {
        response = await axios.post("/api/get-reviewbyreviewee", { user_id: userID, role });
      } else {
        setError("Invalid type for reviews.");
        setLoading(false);
        return;
      }

      console.log(response.data);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError("No Reviews There!.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchReviews();
    } else {
      setError("User ID is missing.");
    }
  }, [userID, type]);

  const handleExpand = (review) => {
    setExpandedReview(review);
  };

  const handleCloseOverlay = () => {
    setExpandedReview(null);
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (

    <div className="task-review-container">
      {reviews.map((review) => (
        <div
          key={review.review_id}
          className="review-card"
          onClick={() => handleExpand(review)}
        >
          <h3>Task ID: {review.task_id}</h3>
          <p>Rating: {review.rating}/5</p>
          <p>Feedback: {review.comments}</p>
          
        </div>
      ))}

      {/* Overlay Popup for Expanded Payment */}
      {expandedReview && (
        <div className="popup-overlay" onClick={handleCloseOverlay}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <h3>Review Details</h3>
            <p><strong>Task ID:</strong> {expandedReview.task_id}</p>
            <p><strong>Reviewer ID:</strong> {expandedReview.reviewer_id}</p>
            <p><strong>Reviewee ID:</strong> {expandedReview.reviewee_id}</p>
            <p><strong>Rating:</strong> {expandedReview.rating}/5</p>
            <p><strong>Review Date:</strong> {new Date(expandedReview.review_date).toLocaleDateString()}</p>
            <div className="button-group">
              <button className="cancel-button" onClick={handleCloseOverlay}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskReview;







