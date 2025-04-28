import React, { useEffect, useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for styling
import CurrentTaskRender from "./CurrentTaskRender";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearView } from "../redux/employeeViewSlice";
import ReviewForm from "./ReviewForm"; // Import the ReviewForm component

const EmployerOrders = ({ enrichedOrders }) => {
  const dispatch = useDispatch();
  const { userID, role } = useSelector((state) => state.user);
  const [expandedOrderIndex, setExpandedOrderIndex] = useState(null); // Tracks the currently expanded order by index
  const [currentMapOrderIndex, setCurrentMapOrderIndex] = useState(null); // Tracks the order index for which the map is displayed
  const [vehicleTypes, setVehicleTypes] = useState([]); // Stores formatted vehicle types for each order
  const [showReviewForm, setShowReviewForm] = useState(false); // Tracks whether to show the review form
  const [reviewFormData, setReviewFormData] = useState({}); // Stores data for the review form

  const handleExpand = (index) => {
    setExpandedOrderIndex(index);
  };

  const handleBack = () => {
    setExpandedOrderIndex(null);
  };

  const handleViewMap = (index) => {
    setExpandedOrderIndex(null);
    setCurrentMapOrderIndex(index);
  };

  const completeTask = async (task_id) => {
    try {
      axios.put("/api/complete-task", { task_id, status: 'completed' })
        .then((response) => {
          console.log(response);
          dispatch(clearView());
        })
        .catch((err) => {
          alert(err.response?.data?.err || "An error occurred during task completion.");
        })
    } catch (error) {

    }
  }


  const updateUserStatus = async (employee_id) => {
    try {
      const userStatus = {
        user_id: employee_id,
        status: "Active", 
        fromVehicleStatus: "In Use",
        toVehicleStatus: "Active"
      };
      const response = await axios.post("/api/users/update-employee-status", userStatus);

      if (response.status === 200) {
        console.log("User status updated successfully:", response.data);
      } else {
        console.error("Failed to update user status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCompleteTask = (index) => {
    const task_id = enrichedOrders[index].task_id;
    const role_id = enrichedOrders[index].role_id;
    console.log(task_id,role_id);
    completeTask(task_id);
    // Show the review form with necessary data
    setReviewFormData({ task_id: task_id, role_id: role_id });
    setShowReviewForm(true);

    updateUserStatus(userID);
  }

  useEffect(() => {
    const setTypes = () => {
      const formattedVehicleTypes = enrichedOrders.map((order) => {
        switch (order.vehicleType) {
          case "2wheeler":
            return "Two Wheeler";
          case "3wheeler":
            return "Three Wheeler";
          case "4wheeler":
            return "Four Wheeler";
          case "truck":
            return "Truck";
          default:
            return "Unknown Vehicle";
        }
      });
      setVehicleTypes(formattedVehicleTypes);
    };

    setTypes();
  }, [enrichedOrders]); // Run whenever enrichedOrders changes
  if (showReviewForm) {
    // Render ReviewForm if showReviewForm is true
    return (
      <ReviewForm
        taskId={reviewFormData.task_id}
        revieweeId={reviewFormData.role_id}
      />
    );
  }

  return (
    <div className="task-review-container">
      {/* Map Display Section */}
      {currentMapOrderIndex !== null && (
        <div className="map-container">
          <h3>Status Map for Task {currentMapOrderIndex + 1}</h3>
          <div className="map-render">
            <CurrentTaskRender />
            <p>Map rendering for task {currentMapOrderIndex + 1} will appear here.</p>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="task-cards-container">
        {enrichedOrders.map((order, index) => (
          <div
            key={index}
            className={`review-card ${expandedOrderIndex === index ? "expanded" : ""}`}
            onClick={() => handleExpand(index)}
          >
            <p>
              <strong>{role === "Employee" ? "Employer" : "Employee"} Name:</strong> {order.employeeName}
            </p>
            <p>
              <strong>Task ID: </strong> <span className="status-highlight">{order.task_id}</span>
            </p>
            <p>
              <strong>Status:</strong> <span className="status-highlight">{order.taskStatus}</span>
            </p>
            <p>
              <strong>Payment:</strong> {order.payment}
            </p>
            <p>
              <strong>Vehicle Type:</strong> {vehicleTypes[index]}
            </p>
            <p>
              <strong>Source:</strong> {order.source}
            </p>
            <p>
              <strong>Destination:</strong> {order.destination}
            </p>
            <p>
              <strong>Item Description:</strong> {order.itemDescription}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Order View */}
      {expandedOrderIndex !== null && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div>
              <p>
                <strong>{role === "Employee" ? "Employer" : "Employee"} Name:</strong> {enrichedOrders[expandedOrderIndex].employeeName}
              </p>
              <p>
                <strong>Task ID: </strong> <span className="status-highlight">{enrichedOrders[expandedOrderIndex].task_id}</span>
              </p>
              <p>
                <strong>Status:</strong> {enrichedOrders[expandedOrderIndex].taskStatus}
              </p>
              <p>
                <strong>Payment:</strong> {enrichedOrders[expandedOrderIndex].payment}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {vehicleTypes[expandedOrderIndex]}
              </p>
              <p>
                <strong>Source:</strong> {enrichedOrders[expandedOrderIndex].source}
              </p>
              <p>
                <strong>Destination:</strong> {enrichedOrders[expandedOrderIndex].destination}
              </p>
              <p>
                <strong>Item Description:</strong> {enrichedOrders[expandedOrderIndex].itemDescription}
              </p>
            </div>
            <div className="button-group">
              <button
                onClick={() => handleViewMap(expandedOrderIndex)}
                className="view-map-button"
              >
                View Map
              </button>

              {role === 'Employee' && <button
                onClick={() => handleCompleteTask(expandedOrderIndex)}
                className="complete-button"
              >
                Complete Task
              </button>}

              <button onClick={handleBack} className="back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerOrders;
