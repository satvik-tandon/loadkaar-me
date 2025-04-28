import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/Profile_Settings.css"; // Add styles if needed

const ProfileSettings = () => {
  const { userID } = useSelector((state) => state.user);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    houseNo: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState({});

  // Fetch user profile data from backend
  const fetchProfileData = async () => {
    const profileDetails = {user_id: userID};
    console.log("The profile user's id is:", profileDetails);
    try {
      const response = await axios.post("/api/user", profileDetails);
      console.log(response.data);
      setProfileData(response.data);
      setInitialData(response.data);  // Store initial data for comparison
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      alert("Failed to fetch profile data.");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userID]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle form submission to update profile
  const handleFormSubmit = async (event) => {
    event.preventDefault();
     // Check if any data has changed by comparing with the initial data
     const isDataChanged = Object.keys(profileData).some(
      (key) => profileData[key] !== initialData[key]
    );

    if (!isDataChanged) {
      alert("No changes detected.");
      return; // Prevent submitting if no changes are made
    }
    try {
      const data = {...profileData, user_id: userID};
      console.log("The data before updating is:", data);
      await axios.put("/api/updateProfile", data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-settings-container">
      <h1>Profile Settings</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>House No.:</label>
          <input
            type="text"
            name="houseNo"
            value={profileData.houseNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Locality:</label>
          <input
            type="text"
            name="locality"
            value={profileData.locality}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={profileData.state}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Pincode:</label>
          <input
            type="number"
            name="pincode"
            value={profileData.pincode}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
