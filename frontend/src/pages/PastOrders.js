import React, { useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for styling
import CurrentTaskRender from "./CurrentTaskRender";
import { useSelector } from "react-redux";

const EmployerOrders = ({ enrichedOrders }) => {
  const { role } = useSelector((state) => state.user);
  const [expandedOrderIndex, setExpandedOrderIndex] = useState(null); // Tracks the currently expanded order by index
  const [currentMapOrderIndex, setCurrentMapOrderIndex] = useState(null); // Tracks the order index for which the map is displayed

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

  return (
    <div className="task-review-container">
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
              <strong>Vehicle Type:</strong> {order.vehicleType}
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
              <br/>
              <p>
                <strong>Status:</strong> <span className="status-highlight"> {enrichedOrders[expandedOrderIndex].taskStatus} </span>
              </p>
              <p>
                <strong>Payment:</strong> {enrichedOrders[expandedOrderIndex].payment}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {enrichedOrders[expandedOrderIndex].vehicleType}
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