import { UserQuery } from './query'
import { UserMutation } from './mutation'

export const UserResolvers = {
    ...UserQuery,
    ...UserMutation
}