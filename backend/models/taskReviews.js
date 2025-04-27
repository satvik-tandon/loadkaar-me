module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
        'Review',
        {
            review_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            task_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Tasks', // Name of the referenced table
                    key: 'task_id', // Primary key in the referenced table
                },
                onUpdate: 'CASCADE', // Update task_id if the task's id changes
                onDelete: 'CASCADE', // Delete review if the task is deleted
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            reviewer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User', // Name of the referenced user table
                    key: 'user_id', // Primary key in the user table
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            reviewee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            rating: {
                type: DataTypes.TINYINT,
                allowNull: false,
                validate: {
                    min: 1, // Minimum rating value
                    max: 5, // Maximum rating value
                },
            },
            comments: {
                type: DataTypes.TEXT,
                allowNull: true, // Comments are optional
            },
            review_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // Default to current timestamp
            },
        },
        {
            freezeTableName: true, // Prevent Sequelize from pluralizing table names
            timestamps: false, // Disable Sequelize's createdAt and updatedAt
        }
    );

    Review.associate = (models) => {
        Review.belongsTo(models.Tasks, {
            foreignKey: 'task_id',
            targetKey: 'task_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        Review.belongsTo(models.Users, {
            foreignKey: 'reviewer_id',
            targetKey: 'user_id',
            as: 'Reviewer', // Alias for this association
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        Review.belongsTo(models.Users, {
            foreignKey: 'reviewee_id',
            targetKey: 'user_id',
            as: 'Reviewee', // Alias for this association
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return Review;
};
