const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const WarehouseLocation = sequelize.define('WarehouseLocation', {
        warehouse_location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique location_id
            primaryKey: true, // Set as the primary key
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Warehouse', // Name of the referenced table (should match the name in the database)
                key: 'warehouse_id', // Primary key in the User table
            },
            onUpdate: 'CASCADE', // Update task warehouse_id if the warehouse id changes
            onDelete: 'CASCADE', // Delete tasks if the warehouse_id is deleted
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    }, {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enables createdAt and updatedAt
    });
    
    // Define association with User (if using Sequelize associations)
    WarehouseLocation.associate = (models) => {
        WarehouseLocation.belongsTo(models.Warehouse, {
            foreignKey: "warehouse_id",
            targetKey: 'warehouse_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };

    return WarehouseLocation;
};
