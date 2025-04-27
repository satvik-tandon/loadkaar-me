

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import "../styles/MapPage.css";
import logo from '../assets/logo.jpeg';

const MapPage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

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

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (window.google && value) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: value, types: ["address"] },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setDestinationSuggestions(predictions);
          }
        }
      );
    } else {
      setDestinationSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionSelect = (place, field) => {
    if (field === "origin") {
      setOrigin(place.description);
      setOriginSuggestions([]);
    } else if (field === "destination") {
      setDestination(place.description);
      setDestinationSuggestions([]);
    }
  };

  // Initialize Google Maps Autocomplete
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

      const autocompleteToInstance = new window.google.maps.places.Autocomplete(destinationInputRef.current, options);
      autocompleteToInstance.addListener("place_changed", () => {
        const place = autocompleteToInstance.getPlace();
        if (place.geometry) {
          setDestination(place.formatted_address);
        }
      });
    }
  }, []);

  // Function to handle form submission and calculate the directions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            setDistance(result.routes[0].legs[0].distance.text);
            setDuration(result.routes[0].legs[0].duration.text);
          } else {
            alert("Directions request failed due to " + status);
          }
        }
      );
    } else {
      alert("Please enter both origin and destination.");
    }
  };

  return (
    
    <div className="container">

<header className="navbar">
                <img src={logo} alt="LoadKaar Logo" className="logo" />
                <button className="sign-in-button">Home</button>
            </header>

        <div className="form-container">
          <h1>Calculate Distance</h1>
          <form onSubmit={handleSubmit}>
            <label>From:</label>
            <input
              type="text"
              ref={originInputRef}
              value={origin}
              onChange={handleOriginChange}
              placeholder="Enter origin address"
            />
            <div className="suggestions">
              {originSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionSelect(suggestion, "origin")}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>

            <label>To:</label>
            <input
              type="text"
              ref={destinationInputRef}
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Enter destination address"
            />
            <div className="suggestions">
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionSelect(suggestion, "destination")}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>

            <button type="submit">Get Directions</button>
          </form>
          <div className="result">
            {distance && <p>Distance: {distance}</p>}
            {duration && <p>Estimated Time: {duration}</p>}
          </div>
        </div>

      <footer>
                <p>&copy; 2024 LoadKaar @ All rights reserved.</p>
      </footer>

    </div>
  );
};

export default MapPage;