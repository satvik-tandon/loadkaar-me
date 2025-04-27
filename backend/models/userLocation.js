const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique location_id
            primaryKey: true, // Set as the primary key
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // Name of the referenced table
                key: 'user_id', // Primary key in the User table
            },
            onUpdate: 'CASCADE', // Update location user_id if the User's id changes
            onDelete: 'CASCADE', // Delete location if the User is deleted
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8), // Precise representation for latitude
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8), // Precise representation for longitude
            allowNull: false,
        },
    }, {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enables createdAt and updatedAt
    });
    
    // Define association with User (if using Sequelize associations)
    Location.associate = (models) => {
        Location.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: 'user_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return Location;
};