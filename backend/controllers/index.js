const controllers = {};

controllers.user = require('./user');
controllers.employerTasks = require('./employerTasks');
controllers.employerTaskDetails = require('./employerTaskDetails');
controllers.vehicles = require("./vehicles");
controllers.employerPayment=require("./employerPayment");
controllers.taskReviews=require("./taskReviews");
controllers.userLocation = require('./userLocation');
controllers.employeeTaks = require('./employeeTasks');
module.exports = controllers;