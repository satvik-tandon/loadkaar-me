module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically generates a unique task_id
            primaryKey: true, // Set as the primary key
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true, // Ensure it's a valid email format
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        houseNo: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        locality: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true, // Ensure the phone number contains only numbers
                len: [10, 15], // Allow phone numbers between 10 and 15 characters
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("Active", "Inactive"),
            defaultValue: "Active",
        },
    },
        {
            indexes: [
                {
                    name: 'idx_user_role',
                    fields: ['role']
                }

            ],
            freezeTableName: true, // Prevents Sequelize from pluralizing the table name
            timestamps: true, // Enable createdAt and updatedAt fields
        });

    return User;
};
