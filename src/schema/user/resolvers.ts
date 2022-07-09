import { Query } from './query'
import { Mutation } from './mutation'

export const ResolversUser= {
    ...Query,
    ...Mutation
}