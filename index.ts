import { ApolloServer } from 'apollo-server'

import { connect } from './ConectionDB/db'
import { UserModel } from './src/schema/user/models'
import jwt from 'jsonwebtoken'
import { typeDefinitions } from './src/schema/user/types'
import { ResolversUser } from './src/schema/user/resolvers'

const JWT_SECRET = 'ESTA ES LA PALABRA MAS SEGURA QUE PUDE ENCONTRAR PARA ESTO FUNCIONE MELITO, MIENTRAS CONSIGO LAS ENV'

connect()


const resolvers = {
    ...ResolversUser
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
            const currentUser = UserModel.findById(_id).exec()
            return { currentUser }
        }
        return undefined
    }
})

server.listen().then(({url}) => {
    console.log(`Servidor activo en: ${url}`)
})