// const sequelize = require("../config/db");
const express = require("express");
// const mysql = require("mysql");
const cors = require('cors');
const {user} = require('../controllers')

const router = express.Router();
// router.use(cors);
router.use(express.json());

router.post('/register', user.registerUser);
router.post('/login', user.getUser);


module.exports = router;