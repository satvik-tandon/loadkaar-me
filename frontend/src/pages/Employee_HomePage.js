import React, { useState, useEffect } from "react";
import "../styles/Employee_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { setView, clearView } from '../redux/employeeViewSlice';
import axios from "axios";
import VehiclesPage from "./Vehicles"; // Import your VehiclesPage component
import ProfileSettings from "./Profile_Settings";
import ReviewPayments from "./ReviewPayments";
import TaskReview from "./TaskReview";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";
import { useNavigate } from "react-router-dom";


function Employee_HomePage() {
  const { userID, role } = useSelector((state) => state.user); // Using userID from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentView, activeMenu } = useSelector((state) => state.employeeView);
  console.log(currentView, activeMenu);
  const [currentOrders, setCurrentOrders] = useState(null);
  const [isActive, setIsActive] = useState(true); // State to manage active/inactive status
  const [vehiclesActive, setVehiclesActive] = useState(true); // Initially assume vehicles are not active
  const [enrichedOrders, setEnrichedOrders] = useState([]); // New state to handle enriched orders
  const [rating, setRating] = useState(5); // Default rating is 5
  const [notOccupied, setNotOccupied] = useState(true);

  // Logout Functionality
  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearView());

    navigate("/");
  };

  const fetchUserStatus = async () => {
    try {
      const userData = { user_id: userID };
      const responseMessage = await axios.post("/api/isactive", userData);

      if (responseMessage.data.message === "The User is active") {
        setIsActive(true);
      }
      else {
        setIsActive(false);
      }
    }
    catch (error) {
      setIsActive(false);
      console.error("Error fetching vehicle status:", error);
    }
  };

  // Fetch vehicle status to check if it's active
  const fetchVehicleStatus = async () => {
    try {
      const vehicleDetails = { user_id: userID };
      const response = await axios.post("/api/vehicles/status", vehicleDetails);
      if (response.data.message === "User has at least one active vehicle.") {
        setVehiclesActive(true);
        setIsActive(true);
        updateUserStatus(true);
      } else {
        setVehiclesActive(false);
        setIsActive(false);
        updateUserStatus(true);
      }

    } catch (error) {
      setVehiclesActive(false);
      setIsActive(false);
      updateUserStatus(false);
      console.error("Error fetching vehicle status:", error);
    }
  };

  // Check if any vehicle is active
  const updateToggleStatus = (vehiclesList) => {
    const hasActiveVehicle = vehiclesList.some((vehicle) => vehicle.status === "Active");
    setIsActive(hasActiveVehicle);
    updateUserStatus(hasActiveVehicle);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const checkRole = role === "Employer" ? "Employee" : "Employer";
        const checkStatus = currentView === "pastTasks" ? "completed" : "inprogress";

        const response = await axios.post("/api/employee-tasks", {
          userID,
          role: checkRole,
          taskStatus: checkStatus,
        });

        const tasks = response.data.results;
        setEnrichedOrders(tasks);
        setCurrentOrders(tasks.length > 0); // Boolean flag to check if there are orders


        const resCheckStatus = await axios.post("/api/employee-tasks", {
          userID,
          role: checkRole,
          taskStatus: "inprogress",
        });

        if(role === "Employee" && resCheckStatus.data.results.length > 0) {
          setNotOccupied(false);
        }
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

    if(userID) {
      fetchUserStatus();
      fetchRating();
      if(currentView === "vehicles") {
        fetchVehicleStatus();
      }
      else {
        fetchDetails();
      }
    }


    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };

          // Once location is fetched, store it in the database
          storeLocationInDatabase(location);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }


  }, [userID, role, currentView]);

  const updateUserStatus = async (newStatus) => {
    try {
      const userStatus = {
        user_id: userID,
        status: newStatus ? "Active" : "Inactive", // Set status based on new isActive value
      };
      const response = await axios.post("/api/users/updateStatus", userStatus);

      if (response.status === 200) {
        console.log("User status updated successfully:", response.data);
      } else {
        console.error("Failed to update user status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };


  // Function to store the location in the database
  const storeLocationInDatabase = async (location) => {

    try {
      const payload = {
        user_id: userID,
        latitude: location.lat,
        longitude: location.lng
      };
      // const userVal = { user_id: userID };
      console.log(userID);

      const responseMessage = await axios.post("/api/isactive", { user_id: userID });
      if (responseMessage.data.message === "The User is active") {
        const response = await axios.post("/api/location", payload);

        if (response.status === 200) {
          console.log("Location stored successfully:", response.data);
        } else {
          console.error("Failed to store location:", response.data.message);
        }
      }
      else {
        console.log("The user is not active");
      }
    } catch (error) {
      console.error("Error storing location:", error);
    }
  };

  // Toggle active status
  const toggleStatus = async () => {
    if (!isActive) {
      fetchVehicleStatus();
      if (!vehiclesActive) {
        alert("Please activate your vehicles first.");
        handleMenuClick("Vehicles", "vehicles")
        return;
      }
    }

    setIsActive(!isActive);
    updateUserStatus(!isActive);
  };

  // Function to load the "Vehicles" section in the same page
  const handleMenuClick = (menuItem, view = "default") => {
    dispatch(setView({ activeMenu: menuItem, currentView: view }));
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
            <h1>No Current Tasks!</h1>
          </div>
        );
      case "pastTasks":
        return enrichedOrders.length > 0 ? (
          <PastOrders enrichedOrders={enrichedOrders} />
        ) : (
          <div>
            <br />
            <h1>No Past Tasks!</h1>
          </div>
        );
      case "vehicles":
        return <VehiclesPage
          updateToggleStatus={updateToggleStatus}
        />;
      case "tasksReview": // Add case for tasks review
        return <TaskReview type="Tasks Review" enrichedOrders={enrichedOrders} />;
      case "recReview": // Add case for tasks review
        return <TaskReview type="Received Review" enrichedOrders={enrichedOrders} />;
      case "payments": // Added case for payments
        return <ReviewPayments type="Employee" />;
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
          {/* Toggle Button for Active/Inactive */}

          {notOccupied ?

            <div className="status-toggle">
              <label className="switch">
                <input type="checkbox" checked={isActive} onChange={toggleStatus} />
                <span className="slider"></span>
              </label>
              <div className={`status ${isActive ? "Active" : "Inactive"}`}>
                {isActive ? "ACTIVE" : "INACTIVE"}
              </div>
            </div>
            :
            <div>
              {<h3>Delivery Inprogress</h3>}
            </div>
          }
          <div
            className="profile"
            onClick={() => {
              handleMenuClick("Profile Page", "profile")
            }}
            style={{ cursor: "pointer" }} // Adds a pointer cursor for better UX
          >
            <img src={profile_pic} alt="profile_pic" className="profile-icon" />
            <span>Profile</span>
          </div>
          {/* Logout Button */}
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
            className={`menu-item ${activeMenu === "Current Tasks" ? "active" : ""}`}
            onClick={() => handleMenuClick("Current Tasks")}
          >
            Current Tasks
          </div>
          <div
            className={`menu-item ${activeMenu === "Past Tasks" ? "active" : ""}`}
            onClick={() => handleMenuClick("Past Tasks", "pastTasks")}
          >
            Past Tasks
          </div>
          <div
            className={`menu-item ${activeMenu === "Vehicles" ? "active" : ""}`}
            onClick={() => handleMenuClick("Vehicles", "vehicles")}
          >
            Vehicles
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
            Task Reviews
          </div>
          <div
            className={`menu-item ${activeMenu === "Received Review" ? "active" : ""}`}
            onClick={() => handleMenuClick("Received Review", "recReview")}
          >
            Received Reviews
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

export default Employee_HomePage;
