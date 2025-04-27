import React, { useState, useEffect } from "react";
import "../styles/TaskReview.css";
import axios from "axios";
import { useSelector } from "react-redux";

const ReviewPayments = ({ type }) => {
  const { userID } = useSelector((state) => state.user);
  const [payments, setPayments] = useState([]);
  const [tasks, setTasks] = useState({}); // Store tasks as an object {payment_id: task_id}
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:5001/api/get-payment-details", { user_id: userID,type });
        setPayments(response.data);

        // Fetch task IDs for each payment in a batch call
        const paymentIds = response.data.map(payment => payment.payment_id);
        if (paymentIds.length > 0) {
          const taskResponse = await axios.post("http://localhost:5001/api/get-taskbypayment", { payment_ids: paymentIds });
          setTasks(taskResponse.data.tasks); // Assuming the response contains { tasks: { payment_id: task_id }
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching payment details. Please try again later.");
        setLoading(false);
      }
    };

    if (userID) {
      fetchPayments();
    }
  }, [userID]);

  const handleExpand = (payment) => {
    setExpandedPayment(payment);
  };

  const handleCloseOverlay = () => {
    setExpandedPayment(null);
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="task-review-container">
      {payments.map((payment) => (
        <div
          key={payment.payment_id}
          className="review-card"
          onClick={() => handleExpand(payment)}
        >
          <h3>Payment ID: {payment.payment_id}</h3>
          <p>Amount: ₹{payment.amount}</p>
          <p>Status: {payment.status}</p>
          <p>Payment Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
          <p>Task ID: {tasks[payment.payment_id] || "Fetching..."}</p> {/* Access task ID using the payment_id */}
        </div>
      ))}

      {/* Overlay Popup for Expanded Payment */}
      {expandedPayment && (
        <div className="popup-overlay" onClick={handleCloseOverlay}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <h3>Payment Details</h3>
            <p><strong>Employer ID:</strong> {expandedPayment.employer_id}</p>
            <p><strong>Employee ID:</strong> {expandedPayment.employee_id}</p>
            <p><strong>Amount:</strong> ₹{expandedPayment.amount}</p>
            <p><strong>Status:</strong> {expandedPayment.status}</p>
            <p><strong>Payment ID:</strong>{expandedPayment.payment_id}</p>
            <p><strong>Payment Date:</strong> {new Date(expandedPayment.payment_date).toLocaleDateString()}</p>
            <p><strong>Task ID:</strong> {tasks[expandedPayment.payment_id] || "Fetching..."}</p>
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

export default ReviewPayments;
