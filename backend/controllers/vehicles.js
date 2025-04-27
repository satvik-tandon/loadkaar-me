const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {
    // Add a new vehicle
    addVehicle: async (req, res) => {
        const {
            user_id,
            vehicle_type,
            vehicle_name,
            status,
            benchmark_price,
            capacity,
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO Vehicle (
                    user_id, vehicle_type, vehicle_name, status, benchmark_price, capacity, createdAt, updatedAt
                )
                VALUES (
                    :user_id, :vehicle_type, :vehicle_name, :status, :benchmark_price, :capacity, NOW(), NOW()
                )
            `;


            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        user_id,        // User ID from request
                        vehicle_type,   // Vehicle type (e.g., 'rickshaw', 'auto', etc.)
                        vehicle_name,   // Vehicle name (e.g., 'Honda Activa', etc.)
                        status,        // Vehicle status (e.g., 'available', 'in use', etc.)
                        benchmark_price, // Price (decimal)
                        capacity       // Vehicle capacity (integer)
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({
                message: 'Vehicle added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Remove a vehicle
    removeVehicle: async (req, res) => {
        const { vehicle_id } = req.body; // Get the user ID from request params
        try {
            const removeQuery = `DELETE FROM Vehicle WHERE vehicle_id = ?`;
            // Delete the vehicle from the database
            const result = await sequelize.query(
                removeQuery,
                {
                    replacements: [vehicle_id],
                    type: sequelize.QueryTypes.DELETE
                }
            );

            res.status(200).json({
                message: 'Vehicle removed successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update the status of a vehicle
    updateVehicleStatus: async (req, res) => {
        const { vehicle_id, status } = req.body; // Vehicle ID and new status from the request body
        try {
            const updateQuery = `UPDATE Vehicle SET status = ? WHERE vehicle_id = ?`;
            // Update the vehicle status in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: [status, vehicle_id],
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }

            res.status(200).json({
                message: 'Vehicle status updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get vehicles for a user
    getUserVehicles: async (req, res) => {
        const { user_id } = req.body; // Get the user ID from request params
        try {
            const selectQuery = `SELECT * FROM Vehicle WHERE user_id = :user_id`;
            // Fetch the vehicles of a user from the database
            const vehicles = await sequelize.query(
                selectQuery,
                {
                    replacements: {user_id},
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (vehicles.length === 0) {
                return res.status(200).json({ message: 'No vehicles found for this user' });
            }
            res.status(200).json(vehicles);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get vehicles for a user
    getVehicleStatus: async (req, res) => {
        const { user_id } = req.body; // Get the user ID from request params
        try {
             // SQL query to check if the user has at least one active vehicle
            const statusQuery = `SELECT COUNT(*) AS active_vehicle_count FROM Vehicle WHERE user_id = :user_id AND status = 'Active'`;
                  
            // Execute the query
            const [results] = await sequelize.query(statusQuery, {
              replacements: {user_id}, // Pass userId as a replacement parameter
              type: sequelize.QueryTypes.SELECT, // Specify query type
            });
            // Check if the result has any active vehicles
            const activeVehicleCount = results.active_vehicle_count;
      
            if (activeVehicleCount > 0) {
              return res.status(200).json({ message: "User has at least one active vehicle." });
            } else {
              return res.status(200).json({ message: "User does not have any active vehicles." });
            }
          } catch (error) {
            console.error("Error checking active vehicle status:", error);
            return res.status(500).json({ message: "Server error." });
          }
    },
};
