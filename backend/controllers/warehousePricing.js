const { sequelize } = require('../models'); // Import sequelize instance from models

module.exports = {  
    addWarehousePricing: async (req, res) => {
        const {
            warehouse_id,
            price_per_hour
        } = req.body;
        
        
        try {
            const insertQuery = `
                INSERT INTO WarehousePricing (
                    warehouse_id, price_per_hour, createdAt, updatedAt
                )
                VALUES (
                    :warehouse_id, :price_per_hour, NOW(), NOW()
                )
            `;


            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        warehouse_id,
                        price_per_hour
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({
                message: 'Warehouse Pricing added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Warehouse Pricing
    updateWarehousePricing: async (req, res) => {
        const { warehouse_id,
            price_per_hour } = req.body;
        try {
            const updateQuery = `UPDATE WarehousePricing SET price_per_hour = :price_per_hour WHERE warehouse_id = :warehouse_id`;
            // Update the Warehouse Pricing in the database
            const result = await sequelize.query(
                updateQuery,
                {
                    replacements: {
                        price_per_hour,
                        warehouse_id
                    },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            if (result.length === 0) {
                return res.status(404).json({ error: 'Warehouse Pricing not found' });
            }

            res.status(200).json({
                message: 'Warehouse Pricing updated successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get Warehouse Pricing for a user
    getUserWarehousePricing: async (req, res) => {
        try {
            const { warehouse_ids } = req.body;

            if (!Array.isArray(warehouse_ids) || warehouse_ids.length === 0) {
                return res.status(400).json({ message: "Invalid or missing warehouse_ids" });
            }
            const selectQuery = `SELECT warehouse_id, price_per_hour 
                         FROM WarehousePricing 
                         WHERE warehouse_id IN (:warehouse_ids)`;
                         
            const prices = await sequelize.query(
                selectQuery,
                {
                    replacements: {warehouse_ids: warehouse_ids},
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (prices.length === 0) {
                return res.status(404).json({ message: "No prices found for the provided warehouses" });
              }
          
              console.log(prices);
              // Return the result as a response
              res.status(200).json(prices);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    };