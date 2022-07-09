import { gql } from 'apollo-server'

export const typeDefinitions = gql`
    type Address {
        street: String!
        city: String!
    }

    type User {
        correo: String!
        name: String!
        nameUser: String!
        phone: String
    }

    type Token {
        value: String!
    }

    type Query {
        userCount: Int!
        allUsers:[User]!
        findUser(correo: String!): User
        me: User
    }

    type Mutation {
        createUser(
            correo: String!
            password: String!
            name: String!
            nameUser: String!
        ): User

        login(
            correo: String!
            password: String!
        ): Token
    }
`