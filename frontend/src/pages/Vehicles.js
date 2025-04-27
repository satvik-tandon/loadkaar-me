import "../styles/VehiclesPage.css"; // Create a CSS file for styling
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";

const VehiclesPage = ({ updateToggleStatus }) => {
  const { userID } = useSelector((state) => state.user);
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "2wheeler",
    vehicle_name: "",
    status: "Inactive",
    benchmark_price: "",
    capacity: "",
  });

  const isActiveStatusAllowed = (vehicles, newStatusVehicleId = null) => {
    if (newStatusVehicleId) {
      const activeVehicle = vehicles.find(
        (vehicle) => vehicle.status === "Active" || vehicle.status === "In Use" && vehicle.vehicle_id !== newStatusVehicleId
      );
      return activeVehicle ? false : true;
    } else {
      const activeVehicle = vehicles.find((vehicle) => vehicle.status === "Active" || vehicle.status === "In Use");
      return activeVehicle ? false : true;
    }
  };


  const fetchVehicles = async (updateToggle = true) => {
    try {
      const vehicleDetails = { user_id: userID };
      const response = await axios.post("http://localhost:5001/api/vehicles/user", vehicleDetails);
      if (response.data.message === "No vehicles found for this user") {
        setVehicles([]);
        if (updateToggle)
          updateToggleStatus([]);
      }
      else{
      if (Array.isArray(response.data)) {
        setVehicles(response.data);
        if(updateToggle)
          updateToggleStatus(response.data);
      }
    }      
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles(false);
  }, [userID]);

  const handleAddVehicle = async () => {
    // Validate mandatory fields
    if (
      !newVehicle.vehicle_name.trim() || // Check if vehicle_name is empty
      newVehicle.benchmark_price <= 0 || // Check if benchmark_price is valid
      newVehicle.capacity <= 0 // Check if capacity is valid
    ) {
      alert("Please fill out all fields with valid values.");
      return;
    }
    // Check if the new vehicle has status "Active" and another vehicle is already active
    if (newVehicle.status === "Active"  && !isActiveStatusAllowed(vehicles)) {
      alert("Only one vehicle can be set to Active or In Use at a time.");
      return; // Stop further execution
    }
    try {
      const vehicleData = { ...newVehicle, user_id: userID };

      await axios.post("http://localhost:5001/api/addVehicle", vehicleData);
      alert("Vehicle added successfully");
      fetchVehicles();
      // Clear the input fields by resetting newVehicle
      setNewVehicle({
        vehicle_type: "2wheeler",
        vehicle_name: "",
        status: "Inactive",
        benchmark_price: "",
        capacity: "",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  const handleRemoveVehicle = async (vehicle_id) => {
    try {
      const vehicleId = { vehicle_id: vehicle_id };
      await axios.post("http://localhost:5001/api/vehicles/remove", vehicleId);
      fetchVehicles();
      alert("Vehicle removed successfully");
    } catch (error) {
      console.error("Error removing vehicle:", error);
      alert("Failed to remove vehicle");
    }
  };

  const handleStatusUpdate = async (vehicle_id, status) => {
    // Check if the new status is "Active" and another vehicle is already active
    if (status === "Active"  && !isActiveStatusAllowed(vehicles, vehicle_id)) {
      alert("Only one vehicle can be set to Active or In Use at a time.");
      return; // Stop further execution
    }
    try {
      const vehicleStatus = { vehicle_id: vehicle_id, status: status };
      await axios.put("http://localhost:5001/api/vehicles/update-status", vehicleStatus);
      fetchVehicles();
      alert("Vehicle status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="vehicles-container">
      <h1>Manage Your Vehicles</h1>

      <h2>Add a New Vehicle</h2>
      <div>
        <select
          value={newVehicle.vehicle_type}
          onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
        >
          <option value="2wheeler">2 Wheeler</option>
          <option value="3wheeler">3 Wheeler</option>
          <option value="4wheeler">4 Wheeler</option>
          <option value="truck">Truck</option>
        </select>
        <input
          type="text"
          placeholder="Vehicle Name"
          value={newVehicle.vehicle_name}
          onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_name: e.target.value })}

        />
        <select
          value={newVehicle.status}
          onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="In Use">In Use</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          type="number"
          placeholder="Enter Amount in INR per Kilometer"
          value={newVehicle.benchmark_price}
          onChange={(e) => setNewVehicle({ ...newVehicle, benchmark_price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Enter the capacity that you can carry in your vehicle"
          value={newVehicle.capacity}
          onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
        />
        <button onClick={handleAddVehicle}>Add Vehicle</button>
      </div>

      <h2>Your Vehicles</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Status</th>
            <th>Benchmark Price</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="6">No vehicles available</td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.vehicle_id}>
                <td>{vehicle.vehicle_type}</td>
                <td>{vehicle.vehicle_name}</td>
                <td>
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleStatusUpdate(vehicle.vehicle_id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="In Use">In Use</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>{vehicle.benchmark_price}</td>
                <td>{vehicle.capacity}</td>
                <td>
                  <button onClick={() => handleRemoveVehicle(vehicle.vehicle_id)}>Remove</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehiclesPage;
