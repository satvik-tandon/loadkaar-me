const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Tasks = sequelize.define('Tasks', {
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique task_id
            primaryKey: true, // Set as the primary key
        },
        payment_id: {
            type: DataTypes.UUID, // Matches CHAR(36) for UUID format
            allowNull: false, // Required field
            references: {
                model: 'Payment',
                key: 'payment_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        employer_id: {
            type: DataTypes.INTEGER,
            allowNull: false, // Required field
            references: {
                model: 'User', // Name of the referenced table
                key: 'user_id', // Referenced column
            },
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false, // Required field
            references: {
                model: 'User', // Name of the referenced table
                key: 'user_id', // Referenced column
            },
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Enable createdAt and updatedAt fields
    });

    Tasks.associate = (models) => {
        Tasks.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };
    return Tasks;
};