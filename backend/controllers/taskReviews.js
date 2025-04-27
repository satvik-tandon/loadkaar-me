const { sequelize } = require("../models");
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs
module.exports = {
    getReviewsByReviewerId: async (req, res) => {
        const { user_id: reviewer_id, role} = req.body; // Expecting reviewer_id from the request body
        console.log(reviewer_id);
        try {
            const selectQuery = `
                SELECT * FROM Review
                WHERE reviewer_id = :reviewer_id AND role LIKE :role ;
            `;

            const reviewDetails = await sequelize.query(selectQuery, {
                replacements: { reviewer_id, role },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!reviewDetails && reviewDetails.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this reviewer.' });
            }

            res.status(200).json(reviewDetails);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching reviews by reviewer_id' });
        }
    },

    getReviewsByRevieweeId: async (req, res) => {
        const { user_id: reviewee_id, role } = req.body; // Expecting reviewee_id from the request body

        try {
            const selectQuery = `
                SELECT * FROM Review
                WHERE reviewee_id = :reviewee_id AND role NOT LIKE :role ;
            `;

            const reviewDetails = await sequelize.query(selectQuery, {
                replacements: { reviewee_id, role },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!reviewDetails && reviewDetails.length === 0) {
                return res.status(404).json({ message: 'No reviews found for this reviewee.' });
            }

            res.status(200).json(reviewDetails);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching reviews by reviewee_id' });
        }
    },
    insertReview: async (req, res) => {
        const { reviewData } = req.body;
        const { task_id, reviewer_id, reviewee_id, role, rating, comments } = reviewData;

        try {
            // Validate the input
            if (!task_id || !role || !reviewer_id || !reviewee_id || !rating) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
            }

            // Raw SQL query to insert the review
            const insertQuery = `
                INSERT INTO Review (
                    review_id, task_id, role, reviewer_id, reviewee_id, rating, comments, review_date
                ) VALUES (
                    :review_id, :task_id, :role, :reviewer_id, :reviewee_id, :rating, :comments, :review_date
                )
            `;

            // Execute the query
            const review_id = uuidv4(); // Generate unique review_id
            const review_date = new Date(); // Current date and time

            await sequelize.query(insertQuery, {
                replacements: {
                    review_id,
                    task_id,
                    role,
                    reviewer_id,
                    reviewee_id,
                    rating,
                    comments: comments || null, // Null if no comments are provided
                    review_date,
                },
                type: sequelize.QueryTypes.INSERT,
            });

            res.status(201).json({ message: 'Review inserted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while inserting the review.' });
        }
    }   ,
    getAverageRating: async (req, res) => {
        const { user_id: user_id } = req.body;
        try {
            // Validate input
            if (!user_id) {
                return res.status(400).json({ message: 'Missing required parameter: reviewee_id.' });
            }

            // Raw SQL query to calculate average rating
            const avgRatingQuery = `
                SELECT AVG(rating) AS avg_rating
                FROM Review
                WHERE reviewee_id = :user_id
            `;

            // Execute the query
            const [results] = await sequelize.query(avgRatingQuery, {
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT,
            });

            // Handle case where no reviews are found
            if (!results.avg_rating) {
                return res.status(404).json({ message: 'No reviews found for the specified reviewee_id.' });
            }

            // Return the average rating
            res.status(200).json({ averageRating: parseFloat(results.avg_rating).toFixed(2) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while calculating the average rating.' });
        }
    } 
};
