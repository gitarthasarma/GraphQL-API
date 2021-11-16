const Sequelize = require('sequelize');
const db = require('../utils/database');

const Shop = db.define('shop', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phNum: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    enPassword: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Shop;