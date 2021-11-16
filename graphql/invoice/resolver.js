const Invoice = require('../../models/invoice');
const Item = require('../../models/item');
const Shop = require('../../models/shop');
const validator = require('validator');
const auth = require('../../auth/token');


const getAllItems = async(invoiceId) => {
    return Item.findAll({
        where: {
            invoiceId
        }
    });
}

const invoicesWithItems = async (invoices) => {
    let newInvoices = [];

    for (let i = 0; i < invoices.length; i++) {
        const itemsForInvoice = await getAllItems(invoices[i].invoiceId);
        newInvoices.push(invoices[i]);
        newInvoices[i].items = itemsForInvoice;
    }

    return newInvoices;
}

module.exports = {
    getAllInvoices: async ({getAllInvoicesInput}) => {
        const {email, token} = getAllInvoicesInput;
        const shop = await Shop.findOne({
            where: {
                email
            }
        });


        if (auth.verifyTokenWithUser(token, shop)) {

            //authenticated
            const shopId = shop.id;
            const invoices = await Invoice.findAll({
                where: {
                    shopId
                }
            });

            invoices.forEach((invoice, idx, arrr) => {
                invoice.dataValues.invoiceId = invoice.dataValues.id;
                delete invoice.dataValues.id;
                arrr[idx] = invoice.dataValues;
            });

            const newInvoices = await invoicesWithItems(invoices);

            return {
                message: "successfull",
                invoices: newInvoices,
                status: 200

            }
        }

        const error = new Error('Invalid Email');
        error.code = 403;
        throw error;
    },


    deleteAllInvoices: async ({deleteAllInvoicesInput}) => {
        const {email, token} = deleteAllInvoicesInput;

        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (auth.verifyTokenWithUser(token, shop)) {
            //authenticated
            try {
                await Invoice.destroy({
                    where: {
                        shopId: shop.id
                    }
                });
                return {
                    message: "Successfully deleted all invoices",
                    status: 202
                }

            } catch (err) {
                const error = new Error('Could not delete all invoices');
                error.status = 500;
                throw error;
            }

        } 
        const error = new Error('Invalid credentials');
        error.code = 403;
        throw error;
    },


    getInvoice: async function({ getInvoiceInput }) {
        const {invoiceId, token} = getInvoiceInput;

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            const error = new Error('Invalid invoiceId');
            error.code = 410;
            throw error;
        }
        const shop = await Shop.findByPk(invoice.shopId);

        if (auth.verifyTokenWithUser(token, shop)) {
            // authenticated
        
            const items = await Item.findAll({ where: { invoiceId: invoiceId }});
            
            // console.log(items);
            items.forEach((elem, idx, items) => {
                delete elem.dataValues.id;
                delete elem.dataValues.invoiceId;
                delete elem.dataValues.createdAt;
                delete elem.dataValues.updatedAt;
                items[idx] = elem;
            });

            return {
                "message": "successfull",
                buyerName: invoice.buyerName,
                buyerContactNumber: invoice.buyerContactNum,
                dateTimeTransac: invoice.dateTimeTransac,
                totalAmount: invoice.totalAmount,
                invoicePaid: invoice.invoicePaid,
                items: items,
                shopId: invoice.shopId,
                status: 200
            }
        }

        const error = new Error('Invalid token');
        error.code = 403;
        throw error;

        
    },


    postInvoice: async function ({ postInvoiceInput }) {
        const {
            shopId,
            buyerName, 
            buyerContactNum, 
            totalAmount, 
            items, 
            invoicePaid, 
            token } = postInvoiceInput;
        
        const dateTimeTransac = new Date(postInvoiceInput.dateTimeTransac);
        const shop = await Shop.findByPk(shopId);


        if (!validator.isLength(buyerContactNum, {min:10,max:10})) {
            const error = new Error('Invalid Phone number');
            throw error;
        }


        if (auth.verifyTokenWithUser(token, shop)) {

            // after authenticating
            const invoice = await Invoice.findOne({
                where: {
                    buyerName: buyerName,
                    buyerContactNum: buyerContactNum,
                    dateTimeTransac: dateTimeTransac,
                    totalAmount: totalAmount,
                    invoicePaid: invoicePaid,
                    shopId: shopId
                }
            });


            if (invoice ) {
                const error = new Error('Invoice already exists');
                const invoiceId = invoice.id;
                delete invoice.dataValues.id;
                invoice.dataValues.invoiceId = invoiceId;
                error.code = 409;
                invoice.dataValues.items = items;
                error.data = invoice.dataValues;
                throw error;
            }
            
            // create new invoice
            const newInvoice = await shop.createInvoice({
                buyerName,
                buyerContactNum,
                dateTimeTransac,
                totalAmount,
                invoicePaid
            });

            items.forEach(item => {
                newInvoice.createItem({
                ...item
                });   
            });

            return {
                message: "Invoice created successfully",
                buyerName: newInvoice.buyerName,
                buyerContactNumber: newInvoice.buyerContactNum,
                dateTimeTransac: newInvoice.dateTimeTransac,
                totalAmount: newInvoice.totalAmount,
                invoicePaid: newInvoice.invoicePaid,
                items: items,
                shopId: newInvoice.shopId,
                invoiceId: newInvoice.id,
                status: 201
            }

        }
        const error = new Error('Invalid credentials');
        error.code = 403;
        throw error;
    },


    deleteInvoice: async function ({deleteInvoiceInput}) {
        const {invoiceId, token} = deleteInvoiceInput;
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            const error = new Error('Invalid invoiceId');
            error.code = 422;
            throw error;
        }
        // console.log(invoice);
        const shop = await Shop.findByPk(invoice.shopId);
        if (auth.verifyTokenWithUser(token, shop)) {
            invoice.destroy();
            return {
                message: "Invoice Deletion Successful",
                status:202
            }
        }

        const error = new Error('Invalid token');
        error.status = 403;
        throw error;
    },


    updateInvoice: async function ({updateInvoiceInput}) {
        const { invoiceId, token, invoicePaid } = updateInvoiceInput;
        const invoice = await Invoice.findByPk(invoiceId);
        const shop = await Shop.findByPk(invoice.shopId);

        if (auth.verifyTokenWithUser(token, shop)) {
            // authenticated
            if (!invoice) {
                const error = new Error('Invoice not found');
                error.code = 422;
                throw error;
            }
            invoice.invoicePaid = invoicePaid;
            invoice.save();
            return {
                message: "Updation successful",
                status: 200
            }
        }

        const error = new Error('Invalid token');
        error.code = 403;
        throw error;
    }
}
