/* global google */

import React, { useEffect, useRef, useState } from "react";
import "../styles/BookDeliveryPartner.css";
import { useDispatch } from "react-redux";
import { setDeliveryFormData } from "../redux/deliveryPartnerViewSlice";


function BookWarehouse({ onClose, onFindDeliveryPartner }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        itemDescription: "",
        itemLocation: "",
        contactPerson: "",
        contactAddress: "",
        contactPhoneNumber: ""
    });

    const [errors, setErrors] = useState({
        itemDescription: "",
        itemLocation: "",
        contactPerson: "",
        contactAddress: "",
        contactPhoneNumber: ""
    });

    const [origin, setOrigin] = useState("");
    const [originSuggestions, setOriginSuggestions] = useState([]);

    const originInputRef = useRef(null);


    useEffect(() => {
        if (window.google) {
            const options = { types: ["address"] };
            const autocompleteFromInstance = new window.google.maps.places.Autocomplete(originInputRef.current, options);
            autocompleteFromInstance.addListener("place_changed", () => {
                const place = autocompleteFromInstance.getPlace();
                if (place.geometry) {
                    setOrigin(place.formatted_address);
                }
            });
        }
    }, []);


    const validateInput = (name, value) => {
        let errorMessage = "";
        switch (name) {
            case "itemDescription":
                if (value.trim().length === 0) {
                    errorMessage = "Item description is required.";
                } else if (value.length > 500) {
                    errorMessage = "Item description cannot exceed 500 characters.";
                }
                break;
            case "itemLocation":
                if (value.trim().length === 0) {
                    errorMessage = "Item location is required.";
                }
                break;
            case "contactPerson":
                if (value.trim().length === 0) {
                    errorMessage = "Contact person's name is required.";
                }
                break;
            case "contactAddress":
                if (value.trim().length === 0) {
                    errorMessage = "Contact address is required.";
                }
                break;
            case "contactPhoneNumber":
                if (!/^[\d+\-\s]*$/.test(value)) {
                    errorMessage = "Phone number can only contain digits, '+', '-' and spaces.";
                } else {
                    errorMessage = ""; // No error if input matches the allowed characters
                }
                break;
            default:
                break;
        }
        return errorMessage;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        const error = validateInput(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    // const isFormValid = () => {
    //     return Object.values(errors).every((error) => error === "") &&
    //         Object.values(formData).every((value) => {
    //             // Ensure non-empty or non-null check for all form data fields except for distance and duration
    //             if (value === null || value === undefined) {
    //                 return false; // If value is null or undefined, return false
    //             }
    //             return typeof value === "string" ? value.trim() !== "" : value !== null; // Check if value is string and not empty, or non-null for others
    //         }) &&
    //         formData.distance !== null && // Ensure distance has been calculated
    //         formData.duration !== null; // Ensure duration has been calculated
    // };


    // Function to handle changes and fetch suggestions
    const handleOriginChange = async (e) => {
        const value = e.target.value;
        setOrigin(value);

        if (window.google && value) {
            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(
                { input: value, types: ["address"] },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setOriginSuggestions(predictions);
                    }
                }
            );
        } else {
            setOriginSuggestions([]);
        }
    };

    // Handle selecting a suggestion
    const handleSuggestionSelect = (place, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: place.description }));
        if (field === "itemLocation") {
            setOrigin(place.description);
            setOriginSuggestions([]);
        } 
    };

    const isFormValid = () => {
        return Object.values(errors).every((error) => error === "") &&
            Object.values(formData).every((value) => {
                // Ensure non-empty or non-null check for all form data fields except for distance and duration
                if (value === null || value === undefined) {
                    return false; // If value is null or undefined, return false
                }
                return typeof value === "string" ? value.trim() !== "" : value !== null; // Check if value is string and not empty, or non-null for others
            })
    };    

    useEffect(() => {
        dispatch(setDeliveryFormData({ ...formData }));
    }, [formData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            
            if (isFormValid()) {
                onClose();
                onFindDeliveryPartner();
            } else {
                if (formData.itemLocation.length === 0)
                    alert("Please select the item location.");
                else
                    alert("Please fill the details!");
            }
        } catch (error) {
            console.error("Error while calculating distance:", error);
        }
    };
    

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Book Warehouse</h2>
                <form>

                    <label>
                        Item Description:
                        <textarea
                            onChange={handleInputChange}
                            name="itemDescription"
                            maxLength="500"
                            placeholder="Enter item description (max 500 characters)"
                            value={formData.itemDescription}
                            required
                        />
                        {errors.itemDescription && <p className="error">{errors.itemDescription}</p>}
                    </label>

                    <label>Item Location:</label>
                    <input
                        type="text"
                        ref={originInputRef}
                        value={origin}
                        onChange={handleOriginChange}
                        name="itemLocation"
                        placeholder="Enter Item location"
                    />
                    <div className="suggestions">
                        {originSuggestions.map((suggestion) => (
                            <div
                                key={suggestion.place_id}
                                className="suggestion-item"
                                onClick={() => handleSuggestionSelect(suggestion, "itemLocation")}
                            >
                                {suggestion.description}
                            </div>
                        ))}
                    </div>

                    <h3>Receiver Contact Details</h3>
                    <label>
                        Contact Person:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="contactPerson"
                            placeholder="Enter contact person's name"
                            value={formData.contactPerson}
                            required
                        />
                        {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
                    </label>

                    <label>
                        Contact Address:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="contactAddress"
                            placeholder="Enter contact address"
                            value={formData.contactAddress}
                            required
                        />
                        {errors.contactAddress && <p className="error">{errors.contactAddress}</p>}
                    </label>

                    <label>
                        Contact Phone Number:
                        <input
                            onChange={handleInputChange}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^+\-\d]/g, "");
                            }}
                            type="text"
                            name="contactPhoneNumber"
                            placeholder="Enter contact phone number"
                            value={formData.contactPhoneNumber}
                            required
                        />
                        {errors.contactPhoneNumber && <p className="error">{errors.contactPhoneNumber}</p>}
                    </label>

                    <button onClick={handleSubmit} type="submit">
                        Find Warehouse
                    </button>
                </form>

                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default BookWarehouse;