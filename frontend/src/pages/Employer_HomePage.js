import React, { useEffect, useState } from "react";
import "../styles/Employer_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg";
import { clearUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookDeliveryPartner from "./BookDeliveryPartner";
import { clearDeliveryFormData, clearDeliveryPartnerView, setDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";
import FindDeliveryPartnerUsingMap from "./FindDeliveryPartnerUsingMap";
import TaskReview from "./TaskReview";
import axios from "axios";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";
import ReviewPayments from "./ReviewPayments"; // Import the ReviewPayments component
import ProfileSettings from "./Profile_Settings";
import BookWarehouse from "./BookWarehouse";

function Employer_HomePage() {
  const { userID, role } = useSelector((state) => state.user); // Assuming userID is in the Redux state
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState(null);
  const [enrichedOrders, setEnrichedOrders] = useState([]); // New state to handle enriched orders
  const [showBookDeliveryPartner, setBookDeliveryPartner] = useState(false);
  const [showBookWarehouse, setBookWarehouse] = useState(false);
  const { currentView, activeMenu } = useSelector((state) => state.deliveryPartnerView);
  const [rating, setRating] = useState(5); // Default rating is 5

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const checkRole = role === "Employer" ? "Employee" : "Employer";
        const checkStatus = currentView === "pastOrders" ? "completed" : "inprogress";
  
        const response = await axios.post("http://localhost:5001/api/get-tasks", {
          userID,
          role: checkRole,
          taskStatus: checkStatus,
        });
  
        const tasks = response.data.results;
        setEnrichedOrders(tasks);
        setCurrentOrders(tasks.length > 0); // Boolean flag to check if there are orders
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await axios.post("http://localhost:5001/api/get-rating", { user_id: userID });
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

    if (userID && currentView) {
      fetchDetails();
      fetchRating();
    }
  }, [userID, role, currentView]); // Trigger when any of these change
  

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
    // localStorage.removeItem(`payments_${userID}`);
    // localStorage.removeItem(`tasks_${userID}`);

    navigate("/");
  };

  // Book Delivery Partner
  const handleDeliveryBooking = () => {
    setBookDeliveryPartner(true);
  };

   // Book Warehouse
   const handleWarehouseBooking = () => {
    setBookWarehouse(true);
  };

  // Find Delivery Partner
  const handleFindDeliveryPartner = () => {
    setBookDeliveryPartner(false);
    handleMenuClick("", "findDelivery");
  };

  // Find Warehouse
  const handleFindWarehouse = () => {
    setBookWarehouse(false);
    handleMenuClick("", "findWarehouse");
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
      case "pastOrders":
        return enrichedOrders.length > 0 ? (
          <PastOrders enrichedOrders={enrichedOrders} />
        ) : (
          <div>
            <br />
            <h1>No Past Orders!</h1>
          </div>
        );
      case "findDelivery":
        return <FindDeliveryPartnerUsingMap />;
      case "findWarehouse":
          return <FindDeliveryPartnerUsingMap />;
      case "tasksReview": // Add case for tasks review
        return <TaskReview type="Tasks Review" />;
      case "recReview": // Add case for tasks review
        return <TaskReview type="Received Review" />;
      case "payments": // Added case for payments
        return <ReviewPayments type="Employer" />;
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
            className={`menu-item ${activeMenu === "Current Orders" ? "active" : ""}`}
            onClick={() => handleMenuClick("Current Orders")}
          >
            Current Orders
          </div>
          <div
            className={`menu-item ${activeMenu === "Past Orders" ? "active" : ""}`}
            onClick={() => handleMenuClick("Past Orders", "pastOrders")}
          >
            Past Orders
          </div>
          <div
            className={`menu-item ${activeMenu === "Payments" ? "active" : ""}`}
            onClick={() => handleMenuClick("Payments", "payments")}
          >
            Payments
          </div>
          <div
            className={`menu-item ${activeMenu === "Tasks Review" ? "active" : ""}`}
            onClick={() => handleMenuClick("Tasks Review", "tasksReview")}
          >
            Tasks Review
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
          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleDeliveryBooking} className="theme-button">
              Book Delivery Partner
            </button>
            <button onClick={handleWarehouseBooking} className="theme-button">Book Warehouse</button>
          </div>

          {/* Dynamic View Rendering */}
          {renderView()}

          {/* Book Delivery Partner Component */}
          {showBookDeliveryPartner && (
            <BookDeliveryPartner
              onFindDeliveryPartner={handleFindDeliveryPartner}
              onClose={() => setBookDeliveryPartner(false)}
            />
          )}

          {/* Book Warehouse Component */}
          {showBookWarehouse && (
            <BookWarehouse
              onFindWarehouse={handleFindWarehouse}
              onClose={() => setBookWarehouse(false)}
            />
          )}
        </main>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <span>2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Employer_HomePage;
