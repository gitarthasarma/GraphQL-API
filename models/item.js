const Sequelize = require('sequelize');
const db = require('../utils/database');

const Item = db.define('item' , {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    itemName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    itemQty: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pricePerQty: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    discount: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    gst: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    totAmount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = Item;