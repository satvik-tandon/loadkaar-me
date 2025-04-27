/* global google */

import React, { useEffect, useState, useRef, useMemo } from "react";
import { GoogleMap, Marker, LoadScript, Polyline } from "@react-google-maps/api";
import "../styles/CurrentTaskRender.css";

const API_KEY = "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y"; // Replace with your actual API key

const CurrentTaskRender = () => {
  const employeeLocation = useMemo(() => ({ lat: 40.73061, lng: -79.00000 }), []); // Example employee location

  // First task employee comes to the destination (source from form)
  const [userLocation, setUserLocation] = useState(null); // User's initial location

  // User location
  const [employeePosition, setEmployeePosition] = useState(employeeLocation); // Current position of employee

  const [employeePath, setEmployeePath] = useState([]); // Employee's route path
  const [initialDistance, setInitialDistance] = useState(null); // Initial distance between user and employee
  const [initialDuration, setInitialDuration] = useState(null); // Initial duration between user and employee
  const [remainingDistance, setRemainingDistance] = useState(null); // Remaining distance to user
  const [remainingDuration, setRemainingDuration] = useState(null); // Remaining duration to user

  const directionsRenderer = useRef(null); // To render the directions on the map
  const directionsService = useRef(null); // To calculate the directions

  const intervalRef = useRef(null); // Store the interval ID for clearing later
  const travelledPathRef = useRef([]); // Track the path that has been travelled
  const travelledDistance = useRef(0); // Track the traveled distance in meters

  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); // Track whether Google Maps is loaded

  // Restore the state from localStorage on page reload
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("taskState"));
    if (savedState) {
      setUserLocation(savedState.userLocation);
      setEmployeePosition(savedState.employeePosition);
      setEmployeePath(savedState.employeePath);
      setInitialDistance(savedState.initialDistance);
      setInitialDuration(savedState.initialDuration);
      setRemainingDistance(savedState.remainingDistance);
      setRemainingDuration(savedState.remainingDuration);
    } else {
      // Get user's current location only once if no saved state
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location: ", error);
        }
      );
    }
  }, []);

  // Initialize directions renderer and service
  useEffect(() => {
    if (isGoogleLoaded && userLocation && directionsService.current && directionsRenderer.current) {
      const directionsRequest = {
        origin: userLocation,
        destination: employeeLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.current.route(directionsRequest, (response, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(response);
          const path = response.routes[0].overview_path;
          setEmployeePath(path); // Store the path
          
          // Get initial distance and duration
          const route = response.routes[0].legs[0];
          setInitialDistance(route.distance.value); // Store initial distance in meters
          setInitialDuration(route.duration.value); // Store initial duration in seconds
          setRemainingDistance(route.distance.text); // Remaining distance
          setRemainingDuration(route.duration.text); // Remaining duration
        } else {
          console.error("Directions request failed:", status);
        }
      });
    }
  }, [userLocation, employeeLocation, isGoogleLoaded]);

  // Function to animate the employee's marker along the path in a fixed time and update distance/time
  useEffect(() => {
    if (employeePath.length === 0 || initialDistance === null || initialDuration === null || !window.google) return;

    let progress = 0;
    const totalDuration = 15; // Fixed 15 seconds for the animation
    const intervalTime = 100; // Update every 100 milliseconds (0.1 seconds)
    const steps = totalDuration * 10; // Number of steps (10 updates per second)
    const pathLength = window.google.maps.geometry.spherical.computeLength(employeePath); // Length of the polyline path

    const pathInterval = setInterval(() => {
      progress += 1 / steps; // Move in small increments

      if (progress <= 1) {
        // Calculate the current position along the path
        const segmentProgress = progress * pathLength;
        let totalLength = 0;
        let segmentIndex = 0;

        // Find the segment where the current progress lies, but start from the employee location
        for (let i = employeePath.length - 1; i >= 1; i--) {
          const segment = [employeePath[i], employeePath[i - 1]]; // Reverse the segment direction
          const segmentLength = window.google.maps.geometry.spherical.computeLength(segment);
          totalLength += segmentLength;
          if (totalLength >= segmentProgress) {
            segmentIndex = i;
            break;
          }
        }

        // Set the employee position to the current location on the path
        setEmployeePosition(employeePath[segmentIndex]);

        // Add the traveled path to the pathRef for color highlighting
        travelledPathRef.current.push(employeePath[segmentIndex]);

        // Update the traveled distance in meters
        travelledDistance.current = window.google.maps.geometry.spherical.computeLength(travelledPathRef.current);

        // Calculate remaining distance and duration
        const remainingPathLength = initialDistance - travelledDistance.current;
        const remainingTime = (remainingPathLength / initialDistance) * initialDuration;

        // Update the remaining distance and duration
        setRemainingDistance(`${(remainingPathLength / 1000).toFixed(2)} km`);
        setRemainingDuration(`${(remainingTime / 60).toFixed(0)} mins`);
      } else {
        clearInterval(pathInterval); // Stop once the employee reaches the end of the path
        // Reset remaining distance and duration to 0 once the animation completes
        setRemainingDistance("0 km");
        setRemainingDuration("0 mins");
      }

      // Save the current state to localStorage
      localStorage.setItem(
        "taskState",
        JSON.stringify({
          userLocation,
          employeePosition,
          employeePath,
          initialDistance,
          initialDuration,
          remainingDistance,
          remainingDuration,
        })
      );
    }, intervalTime);

    intervalRef.current = pathInterval;

    return () => clearInterval(pathInterval); // Clear the interval on cleanup
  }, [employeePath, initialDistance, initialDuration, userLocation]);

  return (
    <div className="task-container">
      <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={['geometry']}
        onLoad={() => setIsGoogleLoaded(true)} // Set state once Google Maps is loaded
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={14}
          onLoad={(map) => {
            directionsService.current = new window.google.maps.DirectionsService();
            directionsRenderer.current = new window.google.maps.DirectionsRenderer();
            directionsRenderer.current.setMap(map);
          }}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
            />
          )}
          <Marker
            position={employeePosition}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
          />
          <Polyline
            path={travelledPathRef.current}
            options={{
              strokeColor: "#00FF00", // Color for the traveled path
              strokeWeight: 5,
              strokeOpacity: 0.7,
            }}
          />
        </GoogleMap>
      </LoadScript>

      {/* Display remaining distance and duration */}
      {remainingDistance && remainingDuration && (
        <div className="route-info">
          <h4>Remaining Distance: {remainingDistance}</h4>
          <h4>Remaining Duration: {remainingDuration}</h4>
        </div>
      )}
    </div>
  );
};

export default CurrentTaskRender;
