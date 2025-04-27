const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {
    // Add a new warehouse
    addWarehouse: async (req, res) => {
        const {
            user_id,
            warehouse_name,
            availability_status,
            available_sqft,
            amenities,
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO Warehouse (
                    user_id, warehouse_name, availability_status, available_sqft, amenities, createdAt, updatedAt
                )
                VALUES (
                    :user_id, :warehouse_name, :availability_status, :available_sqft, :amenities, NOW(), NOW()
                )
            `;


            const [result] = await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        user_id,
                        warehouse_name,
                        availability_status,
                        available_sqft,
                        amenities
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            // Use the result to fetch the inserted warehouse_id
            const fetchQuery = `
            SELECT LAST_INSERT_ID() AS warehouse_id
            `;

            const [insertedWarehouse] = await sequelize.query(fetchQuery, {
                type: sequelize.QueryTypes.SELECT,
            });

            const warehouse_id = insertedWarehouse.warehouse_id;
            console.log(warehouse_id);
            res.status(201).json({
                message: 'Warehouse added successfully',
            warehouse_id,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Remove a Warehouse
    removeWarehouse: async (req, res) => {
        const { warehouse_id } = req.body;
        try {
            const removeQuery = `DELETE FROM Warehouse WHERE warehouse_id = :warehouse_id`;
            // Delete the warehouse from the database
            const result = await sequelize.query(
                removeQuery,
                {
                    replacements: {warehouse_id},
                    type: sequelize.QueryTypes.DELETE
                }
            );

            res.status(200).json({
                message: 'Warehouse removed successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Warehouse
    updateWarehouse: async (req, res) => {
        const { warehouse_id,
            warehouse_name,
            availability_status,
            available_sqft,
            amenities, } = req.body; // Vehicle ID and new status from the request body
        try {
            const updateQuery = `UPDATE Warehouse SET warehouse_name = :warehouse_name, availability_status = :availability_status,
             available_sqft = :available_sqft, amenities = :amenities WHERE warehouse_id = :warehouse_id`;
            // Update the vehicle status in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        warehouse_name,
                        availability_status,
                        available_sqft,
                        amenities,
                        warehouse_id
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Warehouse not found' });
            }

            res.status(200).json({
                message: 'Warehouse status updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get warehouses for a user
    getUserWarehouses: async (req, res) => {
        const { user_id } = req.body; // Get the user ID from request params
        try {
            const selectQuery = `SELECT * FROM Warehouse WHERE user_id = :user_id`;
            // Fetch the Warehouses of a user from the database
            const warehouse = await sequelize.query(
                selectQuery,
                {
                    replacements: {user_id},
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (warehouse.length === 0) {
                return res.status(200).json({ message: 'No warehouse found for this user' });
            }
            res.status(200).json(warehouse);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    };