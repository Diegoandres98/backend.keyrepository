import { UserModel } from './models'

export const UserQuery = {
    Query: {
        userCount: () => UserModel.collection.countDocuments(),
        allUsers: async ( _root: any,_args: any ) => {
            return UserModel.find({})
        },
        findUser: (_root: any, args: { correo: any }) => {
            const { correo } = args
            return UserModel.findOne({ correo }).exec() 
        },
        me: (_root: any, _args: any, context: { currentUser: any }) => {
            return context.currentUser
        }
    },
}