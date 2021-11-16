const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type ShopMessage {
        message: String!
        shopId: Int
        name: String
        address: String
        phNum: String
        email: String
        token: String
        status: Int
    }

    type Message {
        message: String!
        status: Int
    }


    input ShopRegisterInput {
        name: String!
        address: String!
        phNum: String!
        email: String!
        password: String!
    }

    input GetTokenInput {
        email: String!
        password: String!
    }

    input ShopDeleteInput {
        email: String!
        password: String!
    }

    input GetShopInput {
        email: String!
        token: String!
    }

    type RootQuery {
        getShopDetails(getShopInput: GetShopInput): ShopMessage
        getToken(getTokenInput: GetTokenInput): ShopMessage
    }

    type RootMutation {
        postRegisterShop(postRegisterShopInput: ShopRegisterInput): ShopMessage
        deleteShop(shopDeleteInput: ShopDeleteInput): Message
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);