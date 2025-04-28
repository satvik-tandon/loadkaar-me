import React, { useEffect, useState } from "react";
import "../styles/Employer_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg";
import { clearUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearDeliveryFormData, clearDeliveryPartnerView, setDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";
import TaskReview from "./TaskReview";
import axios from "axios";
import CurrentOrders from "./CurrentOrders";
import ReviewPayments from "./ReviewPayments"; // Import the ReviewPayments component
import ProfileSettings from "./Profile_Settings";
import Warehouse from "./Warehouse";

function Warehouse_HomePage() {
  const { userID } = useSelector((state) => state.user); // Assuming userID is in the Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState(null);
  const [enrichedOrders, setEnrichedOrders] = useState([]); // New state to handle enriched orders
  const [showBookDeliveryPartner, setBookDeliveryPartner] = useState(false);
  const { currentView, activeMenu } = useSelector((state) => state.deliveryPartnerView);
  const [rating, setRating] = useState(5); // Default rating is 5

  // Fetch user details when userID changes
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post("/api/employer-get-tasks", { userID });
        const tasks = response.data.results;

        // Enrich tasks with additional details
        const enrichedOrders = await Promise.all(
          tasks.map(async (task) => {
            const [taskDetails, paymentDetails] = await Promise.all([
              axios.post("/api/employer-get-task-details", { task_id: task.task_id }),
              axios.post("/api/employer-get-payment-details", { payment_id: task.payment_id }),
            ]);

            return {
              task,
              taskDetails: taskDetails.data.results,
              paymentDetails: paymentDetails.data.results,
            };
          })
        );

        setEnrichedOrders(enrichedOrders);
        setCurrentOrders(enrichedOrders.length > 0); // Boolean flag to check if there are orders
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await axios.post("/api/get-rating", { user_id: userID });
        console.log(response);
        if (response.status === 200) {
          setRating(parseFloat(response.data.averageRating)); // Set the rating from the response
        } else {
          console.error("Failed to fetch rating, defaulting to 5.");
          setRating(5); // Default to 5 if no rating is received
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(5); // Default to 5 in case of an error
      }
    };

    if (userID) {
      fetchDetails();
      fetchRating();
    }
  }, [userID]);

  // Handle Menu Click
  const handleMenuClick = (menuItem, view = "default") => {
    dispatch(setDeliveryPartnerView({ activeMenu: menuItem, currentView: view }));
    if (view === "default") {
      dispatch(clearDeliveryFormData());
    }
  };

  // Logout Functionality
  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearDeliveryPartnerView());
    localStorage.removeItem(`payments_${userID}`);
    localStorage.removeItem(`tasks_${userID}`);

    navigate("/");
  };

  // Render View Based on State
  const renderView = () => {
    switch (currentView) {
      case "default":
        return enrichedOrders.length > 0 ? (
          <CurrentOrders enrichedOrders={enrichedOrders} />
        ) : (
          <div>
            <br />
            <h1>No Current Orders!</h1>
          </div>
        );
      case "addwarehouse":
        return <Warehouse/>;
      case "currentholdings":
        return
      case "pastfulfillment":
        return
      case "tasksReview": // Add case for tasks review
        return <TaskReview type="Tasks Review" />;
      case "recReview": // Add case for tasks review
        return <TaskReview type="Received Review" />;
      case "payments": // Added case for payments
        return <ReviewPayments type="Owner" />;
      case "profile": // Added case for payments
        return <ProfileSettings />;
      default:
        return <div>Select a menu item to view details</div>;
    }
  };

  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="LoadKaar Logo" className="logo" />
        </div>
        <div className="notification-container">
          <button className="notification-button" onClick={() => alert("Show Notifications!")}>
            <span className="notification-icon">🔔</span>
            {/* Optional - Notification count */}
            <span className="notification-count">2</span>
          </button>
        </div>
        <h1 className="website-name">LoadKaar</h1>
        <div className="profile-container">
          <div className="profile" onClick={() => {
            handleMenuClick("profilePage", "profile")
          }}
            style={{ cursor: "pointer" }} // Adds a pointer cursor for better UX
          >

            <img src={profile_pic} alt="profile_pic" className="profile-icon" />
            <span>Profile</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div
            className={`menu-item ${activeMenu === "Add Warehouse" ? "active" : ""}`}
            onClick={() => handleMenuClick("Add Warehouse", "addwarehouse")}
          >
            Add Warehouse
          </div>
          <div
            className={`menu-item ${activeMenu === "Current Holdings" ? "active" : ""}`}
            onClick={() => handleMenuClick("Current Holdings", "currentholdings")}
          >
            Current Holdings
          </div>
          <div
            className={`menu-item ${activeMenu === "Past Fulfillment" ? "active" : ""}`}
            onClick={() => handleMenuClick("Past Fulfillment", "pastfulfillment")}
          >
            Past Fulfillment
          </div>
          <div
            className={`menu-item ${activeMenu === "Payments" ? "active" : ""}`}
            onClick={() => handleMenuClick("Payments", "payments")}
          >
            Payments
          </div>
          <div
            className={`menu-item ${activeMenu === "Storage Review" ? "active" : ""}`}
            onClick={() => handleMenuClick("Storage Review", "tasksReview")}
          >
            Storage Review
          </div>
          <div
            className={`menu-item ${activeMenu === "Received Review" ? "active" : ""}`}
            onClick={() => handleMenuClick("Received Review", "recReview")}
          >
            Received Review
          </div>
          <div className="rating">
            <h3>Rating</h3>
            <div className="stars">
              {"⭐".repeat(Math.round(rating))} {/* Show stars dynamically */}
            </div>
            <div>{rating.toFixed(1)}</div> {/* Display rating as a number */}
          </div>
        </aside>

        {/* Main Content Section */}
        <main className="main-content">
          {/* Dynamic View Rendering */}
          {renderView()}

        </main>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <span>2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Warehouse_HomePage;
