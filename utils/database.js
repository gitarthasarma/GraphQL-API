const Sequelize = require('sequelize');

// const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     dialect: 'mysql',
//     host: process.env.DB_HOST
// });


const db = new Sequelize('upbringo', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = db;