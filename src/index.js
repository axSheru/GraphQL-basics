import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Comment from './resolvers/Comment';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import Query from './resolvers/Query';
import User from './resolvers/User';

// Creates the server.
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {   
        Query,
        Mutation,
        User,
        Post,
        Comment,
    },
    context: {
        db
    },
});

// Starts the server.
server.start(() => {
    console.log('Server up!')
});