const { buildSchema } = require('graphql');

// build schemas for getAllInvoices and deleteAllInvoices
module.exports = buildSchema(`
    
    type Item {
        itemName: String!
        itemQty: Int!
        pricePerQty: Float!
        discount: Float!
        gst: Float!
        totAmount: Float!
    }

    type Invoice {
        invoiceId: Int!
        buyerName: String!
        buyerContactNum: String!
        dateTimeTransac: String!
        totalAmount: Float!
        invoicePaid: Boolean!
        items: [Item]
        shopId: Int
    }

    type Invoices {
        message: String!
        invoices: [Invoice]
    }

    type InvoiceMessage {
        message: String!
        buyerName: String
        buyerContactNum: String
        dateTimeTransac: String
        totalAmount: Float
        invoicePaid: Boolean
        items: [Item]
        shopId: Int
        invoiceId: Int
        status: Int
    }

    type Message {
        message: String!
        status: Int
    }

    type GetAllInvoices {
        message: String!
        invoices: [Invoice]
        status: Int
    }

    input ITEM {
        itemName: String!
        itemQty: Int!
        pricePerQty: Float!
        discount: Float!
        gst: Float!
        totAmount: Float!

    }
    input PostInvoiceInput {
        shopId: Int!
        buyerName: String!
        buyerContactNum: String!
        dateTimeTransac: String!
        totalAmount: Float!
        invoicePaid: Boolean!
        token: String!
        items: [ ITEM ]!
    }

    input InvoiceInput {
        invoiceId: Int,
        token: String,
    }

    input UpdateInvoiceInput {
        invoiceId: Int!,
        token: String!,
        invoicePaid: Boolean!
    }

    input InvoiceAll {
        email: String!
        token: String!
    }



    type RootQuery {
        getInvoice(getInvoiceInput: InvoiceInput): InvoiceMessage
        getAllInvoices(getAllInvoicesInput: InvoiceAll): GetAllInvoices                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    }

    type RootMutation {
        postInvoice(postInvoiceInput: PostInvoiceInput): InvoiceMessage

        deleteInvoice(deleteInvoiceInput: InvoiceInput): Message

        updateInvoice(updateInvoiceInput: UpdateInvoiceInput): Message
        
        deleteAllInvoices(deleteAllInvoicesInput: InvoiceAll): Message
    }


    schema {
        query: RootQuery
        mutation: RootMutation
    }

`)