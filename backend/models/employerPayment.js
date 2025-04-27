module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: DataTypes.UUID, // Matches CHAR(36) for UUID format
            allowNull: false, // Required field
            primaryKey: true, // Set as the primary key
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
        amount: {
            type: DataTypes.DECIMAL(10, 2), // Matches DECIMAL(10,2)
            allowNull: false, // Required field
        },
        status: {
            type: DataTypes.ENUM('success', 'failure'), // Enum for payment status
            allowNull: false, // Required field
        },
        payment_date: {
            type: DataTypes.DATE, // Matches TIMESTAMP
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set default value to the current timestamp
        },
    },
    {
        freezeTableName: true, // Prevents Sequelize from pluralizing the table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        
        defaultScope: {
            attributes: { exclude: ['id'] },
        },
    }); 

    return Payment;
};
