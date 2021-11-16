const Sequelize = require('sequelize');
const db = require('../utils/database');

const Invoice = db.define('invoice', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    buyerName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    buyerContactNum: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateTimeTransac: {
        type: Sequelize.DATE,
        allowNull: false
    },
    totalAmount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    invoicePaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = Invoice;