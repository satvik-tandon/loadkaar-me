const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle',{
            vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true, // Automatically generates a unique vehicle_id
                primaryKey: true, // Set as the primary key
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User', // Name of the referenced table (should match the name in the database)
                    key: 'user_id', // Primary key in the User table
                },
                onUpdate: 'CASCADE', // Update task user_id if the User's id changes
                onDelete: 'CASCADE', // Delete tasks if the User is deleted
            },
            vehicle_type: {
                type: DataTypes.ENUM(
                    "2wheeler",
                    "3wheeler",
                    "4wheeler",
                    "truck"
                ),
                allowNull: false,
            },
            vehicle_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true, // Ensure vehicle_name is not empty
                },
            },
            status: {
                type: DataTypes.ENUM("Active", "In Use", "Inactive"),
                defaultValue: "Inactive",
            },
            benchmark_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate: {
                    isDecimal: true, // Ensure it's a valid decimal number
                },
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: true, // Ensure capacity is an integer
                },
            },
        },
        {
            indexes: [
                {
                    name: 'idx_vehicles_type',
                    fields: ['vehicle_type']
                }
            ],
            freezeTableName: true, // Prevents Sequelize from pluralizing the table name
            timestamps: true, // Enables createdAt and updatedAt
        }
    );

    // Define association with User (if using Sequelize associations)
    Vehicle.associate = (models) => {
        Vehicle.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: 'user_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return Vehicle;
};
