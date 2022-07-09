import { gql } from 'apollo-server'
import { UserResolvers, UserTypes } from './user'


export const typeDefs = gql`
    ${UserTypes}
`

export const resolvers = {
    ...UserResolvers
}
