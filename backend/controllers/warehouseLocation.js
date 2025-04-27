const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {
    // Add a new warehouse
    addWarehouseLocation: async (req, res) => {
        const {
            warehouse_id,
            location,
            address
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO WarehouseLocation (
                    warehouse_id, location, address, createdAt, updatedAt
                )
                VALUES (
                    :warehouse_id, :location, :address, NOW(), NOW()
                )
            `;


            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        warehouse_id,
                        location,
                        address
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({
                message: 'Warehouse Location added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Warehouse Location
    updateWarehouseLocation: async (req, res) => {
        const { warehouse_id,
            location,
            address } = req.body; // Vehicle ID and new status from the request body
        try {
            const updateQuery = `UPDATE WarehouseLocation SET location = :location, address = :address WHERE warehouse_id = :warehouse_id`;
            // Update the Warehouse Location in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        location,
                        address,
                        warehouse_id
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Warehouse Location not found' });
            }

            res.status(200).json({
                message: 'Warehouse Location updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get Warehouse Location for a user
    getUserWarehouseLocation: async (req, res) => {
        try {
            const { warehouse_ids } = req.body;

            if (!Array.isArray(warehouse_ids) || warehouse_ids.length === 0) {
                return res.status(400).json({ message: "Invalid or missing warehouse_ids" });
            }
            const selectQuery = `SELECT warehouse_id, address, location 
            FROM WarehouseLocation 
            WHERE warehouse_id IN (:warehouse_ids)`;
            
            const locations = await sequelize.query(
            selectQuery,
            {
                replacements: {warehouse_ids: warehouse_ids},
                type: sequelize.QueryTypes.SELECT
            }
            );

            if (locations.length === 0) {
                return res.status(404).json({ message: "No location found for the provided warehouses" });
            }

            // Return the result as a response
            res.status(200).json(locations);        
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    };