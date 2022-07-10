import { UserModel } from './models'
import { UserInputError } from 'apollo-server'
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'ESTA ES LA PALABRA MAS SEGURA QUE PUDE ENCONTRAR PARA ESTO FUNCIONE MELITO, MIENTRAS CONSIGO LAS ENV'

export const UserMutation = {
    Mutation: {
        createUser: (_root: any, args: any)=>{
            const user = new UserModel({...args})
            return user.save().catch( (error: { message: string }) => {
                throw new UserInputError (error.message,{
                    invalidArgs: args
                })
            })
        },
        login: async (_root: any, args: { correo: any; password: any }) => {
            const user = await UserModel.findOne({ correo: args.correo })
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
    }
}
