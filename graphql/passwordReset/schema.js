const {buildSchema} = require('graphql');

module.exports = buildSchema(`


    type Message {
        message: String!
        status: Int
    }

    input GetTokenResetPasswordInput {
        email: String!
    }

    input PostResetPasswordInput {
        email: String!
        newPassword: String!
        token: String!
    }

    type RootQuery {
        getTokenResetPassword(getTokenResetPasswordInput: GetTokenResetPasswordInput) : Message
    }

    type RootMutation {
        postResetPassword(postResetPasswordInput: PostResetPasswordInput) : Message
    }


    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);