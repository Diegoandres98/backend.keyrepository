import { ApolloServer } from 'apollo-server'
import { connect } from './src/ConectionDB/db'
import { typeDefs, resolvers } from './src/schema'
import jwt from 'jsonwebtoken'
import { UserModel } from './src/schema/user/models'
const JWT_SECRET = 'ESTA ES LA PALABRA MAS SEGURA QUE PUDE ENCONTRAR PARA ESTO FUNCIONE MELITO, MIENTRAS CONSIGO LAS ENV'
connect()
interface JwtPayload {
    id: string,
    correo: string,
    nameUser: string
}

const server = new ApolloServer ({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')){
            const token = auth.substring(7)
            const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload
            const currentUser = UserModel.findById(id).exec()
            return { currentUser }
        }
        return undefined
    }
})

server.listen().then(({url}) => {
    console.log(`Servidor activo en: ${url}`)
})