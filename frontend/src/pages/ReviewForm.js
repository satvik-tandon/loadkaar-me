import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/ReviewForm.css";

const ReviewForm = ({ taskId, revieweeId }) => {
    const { userID, role } = useSelector((state) => state.user);

    const [rating, setRating] = useState(5); // Default rating is 0 (not rated)
    const [comments, setComments] = useState("");
    const [error, setError] = useState(""); // Error message state

    // Dynamically generate skipRedirect link based on the role
    const skipRedirect = `/e${role.slice(1)}-home`;

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            setError("Please select a valid rating between 1 and 5.");
            return;
        }

        try {
            const reviewData = {
                task_id: taskId || 1,
                reviewee_id: revieweeId || 6,
                reviewer_id: userID,
                role: role,
                rating,
                comments: comments || "No Comments Available !", // Default message if no comments
            };

            console.log(reviewData);

            // API call to backend
            axios.post("/api/insert-review", { reviewData } )
            .then((response) => {
                console.log(response);
            })

            // Redirect to the role-based home page
            window.location.href = skipRedirect;
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>Submit Review</h2>
                <form>
                    <div className="form-group">
                        <label>Task ID:</label>
                        <input type="text" value={taskId} disabled />
                    </div>
                    <div className="form-group">
                        <label>Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => {
                                setRating(parseInt(e.target.value));
                                setError(""); // Clear error on change
                            }}
                            required
                        >
                            <option value={0}>Select Rating</option>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label>Comments:</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = skipRedirect)}
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;