import { GraphQLServer } from 'graphql-yoga';

// Scalar types: String, Boolean, Int, Float, ID.

// Type definition (Schema).
// The ! is to indicate it will allways be the return type value.
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add( a: Float!, b: Float! ): Float!
        me: User!
        post: Post!
    },

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    },

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    },
`;


// Resolvers. The querys.
const resolvers = {
    Query: {
        greeting( parent, args, ctx, info ) {
            return ( args.name && args.position ) ? `Hello ${ args.name }! You're my favorite ${ args.position }` : 'Hello!';
        },
        add( parent, args, ctx, info ) {
            return ( args.a && args.b ) ? args.a + args.b : 'Enter numbers';
        },
        me() {
            return {
                id: 'm9803j',
                name: 'Mariana',
                email: 'majipe93@test.com',
                age: 28,
            };
        },
        post() {
            return {
                id: 'jfpo8780s',
                title: 'Young man learns GraphQL',
                body: 'Is amazing! He says about this technology',
                published: true,
            }
        },
    }
};


// Creates the server.
const server = new GraphQLServer({
    typeDefs,
    resolvers
});


// Starts the server.
server.start(() => {
    console.log('Server up!')
});

