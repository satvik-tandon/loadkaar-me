import React from "react";
import logo from "../assets/logo.jpeg"; 
import '../styles/Popup.css'; // Add CSS for styling the popup

function Login({ category, onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{category} Login</h2>
                <form>
                    <label>
                        Username:
                        <input type="text" name="username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" />
                    </label>
                    <button type="submit">Login</button>
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default Login;