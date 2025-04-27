const { sequelize } = require('../models');

module.exports = {
    saveTaskDetails: async (req, res) => {
        const {
            task_id,
            deliveryFormData
        } = req.body;

        const { vehicleType, itemDescription, pickupLocation, dropLocation, contactPerson, contactAddress, contactPhoneNumber } = deliveryFormData;

        // Validate required fields
        if (
            !task_id ||
            !vehicleType ||
            !itemDescription ||
            !pickupLocation ||
            !dropLocation ||
            !contactPerson ||
            !contactAddress ||
            !contactPhoneNumber
        ) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        try {
            // Insert the task details into the database
            const insertQuery = `
                INSERT INTO TaskDetails (
                    task_id,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
                    vehicleType,
                    createdAt,
                    updatedAt
                )
                VALUES (
                    :task_id,
                    :itemDescription,
                    :pickupLocation,
                    :dropLocation,
                    :contactPerson,
                    :contactAddress,
                    :contactPhoneNumber,
                    :vehicleType,
                    NOW(),
                    NOW()
                );
            `;

            // Execute the insert query
            await sequelize.query(insertQuery, {
                replacements: {
                    task_id,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
                    vehicleType
                },
                type: sequelize.QueryTypes.INSERT,
            });

            // Send a success response with the inserted task details ID
            res.status(201).json({
                message: 'Task details saved successfully.',
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while saving the task details.' });
        }
    },

    completeTask: async (req, res) => {
        const { task_id, status } = req.body;

        try {
            if(!task_id) {
                return res.status(400).json({ error: 'Task is invalid.' });
            }

            const updateQuery = `
                UPDATE TaskDetails 
                SET taskStatus = :status,
                    updatedAt = NOW()
                WHERE task_id = :task_id
            `;

            const [result] = await sequelize.query(updateQuery, {
                replacements: { task_id, status },
                type: sequelize.QueryTypes.UPDATE,
            });

            if (result === 0) {
                // If no rows were updated, send a not found response.
                return res.status(404).json({ error: 'Task not found or no changes were made.' });
            }
            return res.status(200).json({ message: 'Task updated successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while completing the task.' });
        }
    }
};
