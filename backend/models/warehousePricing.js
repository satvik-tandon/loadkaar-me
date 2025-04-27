const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const WarehousePricing = sequelize.define('WarehousePricing',
        { warehouse_pricing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    price_per_hour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0, // Ensure price_per_hour is not negative
        },
      },
    price_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0, // Calculated automatically
      },
    price_per_month: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0, // Calculated automatically
      },
},
{
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    timestamps: true, // Enables createdAt and updatedAt
}
);

// Hooks for automatic calculation of price_per_day and price_per_month
WarehousePricing.beforeSave(async (warehousePricing) => {
    if (warehousePricing.price_per_hour) {
      warehousePricing.price_per_day = parseFloat(
        (warehousePricing.price_per_hour * 24).toFixed(2)
      );
      warehousePricing.price_per_month = parseFloat(
        (warehousePricing.price_per_day * 30).toFixed(2)
      );
    }
  });

WarehousePricing.associate = (models) => {
WarehousePricing.belongsTo(models.Warehouse, {
    foreignKey: "warehouse_id",
    targetKey: 'warehouse_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
};

return WarehousePricing;
};