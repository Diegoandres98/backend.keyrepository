import { ApolloServer, gql, UserInputError } from 'apollo-server'

import './ConectionDB/db.js'
import User from './Models/users.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'ESTA ES LA PALABRA MAS SEGURA QUE PUDE ENCONTRAR PARA ESTO FUNCIONE MELITO, MIENTRAS CONSIGO LAS ENV'


const typeDefinitions = gql`
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
const resolvers = {
    Query: {
        userCount: () => User.collection.countDocuments(),
        allUsers: async ( _root: any,_args: any ) => {
            return User.find({})
        },
        findUser: (_root: any, args: { correo: any }) => {
            const { correo } = args
            return User.findOne({ correo }).exec() 
        },
        me: (_root: any, _args: any, context: { currentUser: any }) => {
            return context.currentUser
        }
    },
    Mutation: {
        createUser: (_root: any, args: any)=>{
            const user = new User({...args})
            return user.save().catch( (error: { message: string }) => {
                throw new UserInputError (error.message,{
                    invalidArgs: args
                })
            })
        },
        login: async (_root: any, args: { correo: any; password: any }) => {
            const user = await User.findOne({ correo: args.correo })
            if (!user || args.password !== user.password){
                throw new UserInputError('credenciales invalidas')
            }
            
            const userForToken = {
                correo: user.correo,
                id: user._id,
                nameUser: user.nameUser
            }
            return{
                value: jwt.sign(userForToken, JWT_SECRET, { expiresIn: 300 })
            }
        }
    },
}

interface JwtPayload {
    _id: string
}

const server = new ApolloServer ({
    typeDefs: typeDefinitions,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('bearer ')){
            const token = auth.substring(7)
            const { _id } = jwt.verify(token, JWT_SECRET) as JwtPayload
            const currentUser = User.findById(_id).exec()
            return { currentUser }
        }
        return undefined
    }
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})