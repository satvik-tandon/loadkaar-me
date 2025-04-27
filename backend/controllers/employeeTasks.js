const { sequelize } = require("../models");

module.exports = {
    employeeTasks: async (req, res) => {
        const {userID, role, taskStatus} = req.body;
        if (!userID || !role || !taskStatus) {
            return res.status(400).json({ error: 'Internal Server Error!' });
        }
        
        try {
            selectQuery = `
                SELECT 
                    t.employer_id AS role_id,
                    t.task_id AS task_id,
                    td.vehicleType AS vehicleType, 
                    td.pickupLocation AS source, 
                    td.dropLocation AS destination, 
                    td.itemDescription AS itemDescription,
                    p.amount AS payment,
                    td.taskStatus AS taskStatus,
                    CONCAT(u.firstName, ' ', u.lastName) AS employeeName,
                    COUNT(*) OVER (PARTITION BY t.employee_id, td.taskStatus) AS taskCountPerStatus
                FROM 
                    TaskDetails td
                INNER JOIN 
                    Tasks t ON td.task_id = t.task_id
                INNER JOIN 
                    Payment p ON t.payment_id = p.payment_id
                INNER JOIN 
                    User u ON t.employee_id = u.user_id
                WHERE 
                    td.taskStatus = :taskStatus
                    AND t.employee_id = :userID;
            `;

            const results = await sequelize.query(selectQuery, {
                replacements: { userID, role, taskStatus },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!results.length) {
                return res.status(200).json({ 
                    message: 'No tasks found for this employer.', 
                    results: [],
                });
            }
            else {
                console.log(results);
            }

            res.status(200).json({message: 'Fetched details successfully', results});

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the details' });
        }
    },
};
