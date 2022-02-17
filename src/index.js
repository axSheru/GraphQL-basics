import { GraphQLServer } from 'graphql-yoga';

// Scalar types: String, Boolean, Int, Float, ID.

// Type definition (Schema).
// The ! is to indicate it will allways be the return type value.
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean
    }
`;


// Resolvers. The querys.
const resolvers = {
    Query: {
        id() {
            return 'ab543ds';
        },
        name() {
            return 'Mariana';
        },
        age() {
            return 28;
        },
        employed() {
            return true;
        },
        gpa() {
            return 2.8;
        },
        title() {
            return 'BS Luke Skywalker.';
        },
        price() {
            return 16.99;
        },
        releaseYear() {
            return 2012;
        },
        rating() {
            return 4.8;
        },
        inStock() {
            return true;
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

