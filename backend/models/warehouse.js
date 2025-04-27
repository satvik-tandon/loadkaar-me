const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const Warehouse = sequelize.define('Warehouse',
        { warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    warehouse_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    availability_status: {
        type: DataTypes.ENUM("available", "occupied"),
        defaultValue: "occupied",
    },
    available_sqft: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
        },
    },
    amenities: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
},
{
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    timestamps: true, // Enables createdAt and updatedAt
}
);

// Define association with User (if using Sequelize associations)
Warehouse.associate = (models) => {
Warehouse.belongsTo(models.User, {
    foreignKey: "user_id",
    targetKey: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
};

return Warehouse;
};
