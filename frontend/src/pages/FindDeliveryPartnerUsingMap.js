import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import "../styles/FindDeliveryPartnerUsingMap.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setDeliveryFormData } from "../redux/deliveryPartnerViewSlice";

const GOOGLE_API_KEY = "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y";

const FindDeliveryPartnerUsingMap = () => {
  const { userID } = useSelector((state) => state.user);
  const {
    pickupLocation,
    dropLocation,
    vehicleType,
  } = useSelector((state) => state.deliveryPartnerView.deliveryForm || {});
  const deliveryForm = useSelector((state) => state.deliveryPartnerView.deliveryForm || {});

  const [selectedType, setSelectedType] = useState(vehicleType || "");
  const dispatch = useDispatch();

  const [sourceLocation, setSourceLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [noDriversFound, setNoDriversFound] = useState(false);

  useEffect(() => {
    console.log(deliveryForm);
    if (window.google && pickupLocation && dropLocation) {
      const geoCoder = new window.google.maps.Geocoder();

      geoCoder.geocode({ address: pickupLocation }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setSourceLocation({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });

      geoCoder.geocode({ address: dropLocation }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setDestinationLocation({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    }
  }, [pickupLocation, dropLocation]);

  const fetchDrivers = async (updatedVehicleType = vehicleType) => {
    if (sourceLocation && destinationLocation) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "/api/find-drivers",
          { sourceLocation, vehicleType: updatedVehicleType }
        );
        const data = response.data.results;

        const timeout = setTimeout(() => {
          if (data.length === 0) {
            setNoDriversFound(true);
          }
          else {
            setNoDriversFound(false);
          }
          setIsLoading(false);
        }, 2000);

        setDrivers(data);

        const filteredDrivers = await filterDriversByDistance(
          data,
          sourceLocation,
          5
        );
        setActiveDrivers(filteredDrivers);
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [sourceLocation, destinationLocation, vehicleType]);

  const filterDriversByDistance = (drivers, sourceLocation, maxDistanceKm) => {
    return new Promise((resolve) => {
      const service = new window.google.maps.DistanceMatrixService();

      const origins = drivers.map(
        (driver) =>
          new window.google.maps.LatLng(
            parseFloat(driver.lat),
            parseFloat(driver.lng)
          )
      );
      const destination = new window.google.maps.LatLng(
        sourceLocation.lat,
        sourceLocation.lng
      );

      service.getDistanceMatrix(
        {
          origins,
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const filteredDrivers = response.rows
              .map((row, index) => {
                const distance = row.elements[0].distance.value / 1000;
                const duration = row.elements[0].duration.text;
                console.log(duration);
                return {
                  ...drivers[index],
                  distance,
                  duration,
                };
              })
              .filter((driver) => driver !== null);

            resolve(filteredDrivers);
          } else {
            console.error("Distance Matrix service failed:", status);
            resolve([]);
          }
        }
      );
    });
  };

  const setVehicleType = (event) => {
    const updatedType = event.target.value;
    setSelectedType(updatedType);
    dispatch(setDeliveryFormData({ ...deliveryForm, vehicleType: updatedType })); // Update Redux state
    
    fetchDrivers(updatedType); // Fetch drivers for updated vehicle type
  };

  const handleCardClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverPopup(true);
  };

  const closeDriverPopup = () => {
    setShowDriverPopup(false);
    setSelectedDriver(null);
  };

  const handleAssignTask = () => {
    closeDriverPopup();
    navigate("/payment", { state: { selectedDriver } });
  };

  const [ratings, setRatings] = useState({});

  const fetchRating = async (user_id) => {
    try {
      const response = await axios.post(
        "/api/get-rating",
        { user_id: user_id }
      );
      if (response.status === 200) {
        return parseFloat(response.data.averageRating);
      } else {
        console.error("Failed to fetch rating, defaulting to 5.");
        return 5;
      }
    } catch (error) {
      console.error("No ratings found for the user", error);
      return 5;
    }
  };

  useEffect(() => {
    const loadRatings = async () => {
      const newRatings = {};
      for (const driver of activeDrivers) {
        const rating = await fetchRating(driver.user_id);
        newRatings[driver.user_id] = rating;
      }
      setRatings(newRatings);
    };

    if (activeDrivers.length > 0) {
      loadRatings();
    }
  }, [activeDrivers]);

  return (
    <div className="container">
      <div className="left-pane">
      <h3>Filter by Vehicle Type:</h3>
        <select
          value={selectedType}
          onChange={setVehicleType}
        >
          <option value="2wheeler">Two Wheeler</option>
          <option value="3wheeler">Three Wheeler</option>
          <option value="4wheeler">Four Wheeler</option>
          <option value="truck">Truck</option>
        </select>

        <div className="delivery-partners-container">
        {isLoading ? (
            <h2>Loading delivery partners...</h2>
          ) : noDriversFound ? (
            <h2>There are no drivers found.</h2>
          ) : (
            activeDrivers.map((partner, index) => (
              <div
                key={partner.user_id || index}
                className="card"
                onClick={() => handleCardClick(partner)}
              >
                <h3>
                  {partner.firstname} {partner.lastname}
                </h3>
                <h4>Estimated Time: {partner.duration}</h4>
                <h4>Estimated Price in INR: ₹{partner.estimated_price.toFixed(2)}</h4>
                <p>
                  Rating:{" "}
                  {ratings[partner.user_id]
                    ? `${ratings[partner.user_id]} ⭐`
                    : "Loading..."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="right-pane">
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={sourceLocation || { lat: 0, lng: 0 }}
            zoom={14}
          >
            {sourceLocation && (
              <Marker
                position={sourceLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            )}
            {drivers.map((driver) => (
              <Marker
                key={driver.user_id}
                position={{
                  lat: parseFloat(driver.lat),
                  lng: parseFloat(driver.lng),
                }}
                onClick={() => setSelectedDriver(driver)}
              />
            ))}

            {selectedDriver && selectedDriver.lat && selectedDriver.lng && (
              <InfoWindow
                position={{ lat: parseFloat(selectedDriver.lat), lng: parseFloat(selectedDriver.lng) }}
                onCloseClick={() => setSelectedDriver(null)}
              >
                <div>
                  <h3>{selectedDriver.firstname} {selectedDriver.lastname}</h3>
                  <p>
                  Rating:{" "}
                  {ratings[selectedDriver.user_id]
                    ? `${ratings[selectedDriver.user_id]} ⭐`
                    : "Loading..."}
                </p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        </div>
      </div>

      {showDriverPopup && selectedDriver && (
        <div className="popup-overlay">
          {/* {console.log(showDriverPopup, selectedDriver)} */}
          <div className="popup-content">
            <h3>Driver Details</h3>
            {console.log(selectedDriver)}
            <h2>Name: {`${selectedDriver.firstname} ${selectedDriver.lastname}`}</h2>
            <h4>Kilometers away: {selectedDriver.distance.toFixed(2)} km</h4>
            <h4>Estimated Time: {selectedDriver.duration}</h4>
            <h4>Estimated Price in INR: ₹{selectedDriver.estimated_price.toFixed(2)}</h4>
            <h4>
                  Rating:{" "}
                  {ratings[selectedDriver.user_id]
                    ? `${ratings[selectedDriver.user_id]} ⭐`
                    : "Loading..."}
                </h4>
            <div className="popup-buttons">
              <button onClick={closeDriverPopup}>Back</button>
              <button onClick={handleAssignTask}>Assign Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDeliveryPartnerUsingMap;
