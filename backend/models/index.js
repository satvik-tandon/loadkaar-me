const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/db.sqlite'
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Tasks = require('./employerTasks')(sequelize, Sequelize.DataTypes);
db.models.TaskDetails = require('./employerTaskDetails')(sequelize, Sequelize.DataTypes);
db.models.Vehicle = require('./vehicles')(sequelize, Sequelize.DataTypes);
db.models.Payment = require('./employerPayment')(sequelize, Sequelize.DataTypes);
db.models.Review = require('./taskReviews')(sequelize, Sequelize.DataTypes);
db.models.UserLocation = require('./userLocation')(sequelize, Sequelize.DataTypes);
db.models.Warehouse = require('./warehouse')(sequelize, Sequelize.DataTypes);
db.models.WarehousePricing = require('./warehousePricing')(sequelize, Sequelize.DataTypes);
db.models.WarehouseLocation = require('./warehouseLocation')(sequelize, Sequelize.DataTypes);

module.exports = db;