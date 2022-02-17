import { GraphQLServer } from 'graphql-yoga';

// Type definition (Schema).
// The ! is to indicate it will allways be the return type value.
const typeDefs = `
    type Query {
        hello: String!,
        name: String!,
        location: String!,
        bio: String!,
    }
`;


// Resolvers. The querys.
const resolvers = {
    Query: {
        hello() {
            return 'Hello! This is my first query!';
        },
        name() {
            return 'Alex P';
        },
        location() {
            return 'Puebla, México.';
        },
        bio() {
            return 'I love SW!!!';
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

