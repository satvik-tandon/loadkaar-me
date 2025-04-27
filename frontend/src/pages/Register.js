import React, { useState } from "react";
import "../styles/Register.css"; // Dedicated styles for the register form
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { clearDeliveryFormData, clearDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";

function Register({ role, onClose }) {

    // Hardcoded it for testing and easier registration for now
    const [formData, setFormData] = useState({
        firstName: "test",
        lastName: "test",
        houseNo: "124",
        locality: "test",
        city: "CBE",
        state: "TN",
        pincode: "12345",
        phoneNumber: "876545677",
        email: "test@gmail.com",
        password: "1234",
        role: role
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const userData = {
          email: formData.email,
          password: formData.password,
          role: role
        };

        await axios.post("http://localhost:5001/api/register", formData)
        .then((response) => {
            const userID = response.data.userID;
            
            dispatch(setUser({...userData, userID}));
            dispatch(clearDeliveryFormData());
            dispatch(clearDeliveryPartnerView());

            
            if(role === "Employer")
            {
                navigate('/employer-home');
            }
            else if(role === "Employee")
            {
                navigate('/employee-home');
            }
            else{
                navigate('/warehouse-home');
            }
        })
        .catch (error => alert(error.response?.data?.error || "An error occurred during register."));


    };

    return (
        <div className="popup-overlay">
            <div className="register-popup">
                <h2>Register</h2>
                <div className="form-container">
                    <form onSubmit={handleRegister}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>House No.:</label>
                                <input
                                    type="text"
                                    name="houseNo"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Locality:</label>
                                <input
                                    type="text"
                                    name="locality"
                                    value={formData.locality}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode:</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="register-button">Register</button>
                            <button onClick={onClose} type="button" className="close-button">
                                Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
