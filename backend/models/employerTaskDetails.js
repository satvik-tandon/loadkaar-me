module.exports = (sequelize, DataTypes) => {
    const TaskDetails = sequelize.define(
        'TaskDetails',
        {
            taskDetails_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true, // Automatically generates a unique taskDetails_id
                primaryKey: true, // Set as the primary key
            },
            task_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Tasks', // Name of the referenced table (should match the name in the database)
                    key: 'task_id', // Primary key in the referenced table
                },
                onUpdate: 'CASCADE', // Update task_id if the task's id changes
                onDelete: 'CASCADE', // Delete TaskDetails if the task is deleted
            },
            itemDescription: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 500], // Description must be between 1 and 500 characters
                },
            },
            pickupLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dropLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contactPerson: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 100], // Name must be between 2 and 100 characters
                },
            },
            contactAddress: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [5, 500], // Address must be between 5 and 500 characters
                },
            },
            contactPhoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true, // Ensure the contact phone number contains only numbers
                    len: [10, 15], // Allow phone numbers between 10 and 15 characters
                },
            },
            vehicleType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['2wheeler', '3wheeler', '4wheeler', 'truck']], // Allow only valid vehicle types
                },
            },
            taskStatus: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'inprogress',
                validate: {
                    isIn: [['inprogress', 'completed']],
                },
            },
        },
        {
            freezeTableName: true, // Prevents Sequelize from pluralizing the table name
            timestamps: true, // Enable createdAt and updatedAt fields
        }
    );

    TaskDetails.associate = (models) => {
        TaskDetails.belongsTo(models.Tasks, {
            foreignKey: 'task_id',
            targetKey: 'task_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return TaskDetails;
};
