const { sequelize } = require('../models');
module.exports = {
    storeEmployeeLocation: async (req, res) => {
        const { user_id, latitude, longitude } = req.body;
        // Validate required fields
        if (!user_id || !latitude || !longitude) {
            return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (user_id, latitude, longitude)." 
        });  
        }
        try {
            // SQL query to check if a location exists for the user_id
            const checkQuery = `SELECT * FROM Location WHERE user_id = :user_id`;
            const rows = await sequelize.query(checkQuery, { 
                replacements: {
                user_id
            },
            type: sequelize.QueryTypes.SELECT});

            if (rows.length > 0) {
                // If a record exists, update the location
                const updateQuery = `UPDATE Location SET latitude = :latitude, longitude = :longitude, updatedAt = NOW() WHERE user_id = :user_id`;
                await sequelize.query(updateQuery, { 
                    replacements: {
                    user_id,
                    latitude,
                    longitude
                },
                type: sequelize.QueryTypes.UPDATE});
                return res.status(200).json({ message: "Location updated successfully." });
            }

            // SQL query to insert the location into the database
            const insertQuery = `INSERT INTO Location (user_id, latitude, longitude, createdAt, updatedAt) VALUES (:user_id, :latitude, :longitude, NOW(), NOW())`;
            await sequelize.query(
                insertQuery,
                {
                    replacements: {
                        user_id,        // User ID from request
                        latitude,
                        longitude
                    },
                    type: sequelize.QueryTypes.INSERT
                }
            );
            res.status(200).json({
                message: 'Location added successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    };