const express = require('express');
const cors =require('cors');
const https = require('https');
const { graphqlHTTP } = require('express-graphql');
const fs = require('fs');

const db = require('./utils/database');
const Invoice = require('./models/invoice');
const Shop = require('./models/shop');
const Item = require('./models/item');
const shopSchema = require('./graphql/shop/schema');
const shopResolver = require('./graphql/shop/resolver');
const invoiceSchema = require('./graphql/invoice/schema');
const invoiceResolver = require('./graphql/invoice/resolver');
const forgotPasswordSchema = require('./graphql/passwordReset/schema');
const forgotPasswordResolver = require('./graphql/passwordReset/resolver');
const PORT = 5000;

const app = express();


app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// relations
Invoice.belongsTo(Shop, { foreignKey: 'shopId', constraints: true, onDelete: 'CASCADE' });
Shop.hasMany(Invoice);

Item.belongsTo(Invoice, { foreignKey: 'invoiceId', constraints: true, onDelete: 'CASCADE' });
Invoice.hasMany(Item);

// custom error formatting
const customFormatErrorFn = (err) =>  {
    if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data }
}


app.use('/shop', graphqlHTTP({
    schema: shopSchema,
    rootValue: shopResolver,
    graphiql: true,
    customFormatErrorFn
    })
);

app.use('/invoice', graphqlHTTP({
    schema: invoiceSchema,
    rootValue: invoiceResolver,
    graphiql: true,
    customFormatErrorFn
}));

app.use('/resetPassword', graphqlHTTP({
    schema: forgotPasswordSchema,
    rootValue: forgotPasswordResolver,
    graphiql: true,
    customFormatErrorFn
    })
);


// {force: true}
db.sync()
    .then(res => {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    },app)
        .listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            })
        })
    .catch(err => {
        console.log(err);
    });