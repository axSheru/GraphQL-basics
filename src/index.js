import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

// Resolvers. The querys.
const resolvers = {
    Query: {
        greeting( parent, args, ctx, info ) {
            return ( args.name && args.position ) ? `Hello ${ args.name }! You're my favorite ${ args.position }` : 'Hello!';
        },
        add( parent, args, ctx, info ) {
            return ( args.a && args.b ) ? args.a + args.b : 'Enter numbers';
        },
        add2( parent, args, ctx, info ) {
            if ( args.numbers.length ) {
                return args.numbers.reduce( ( accumulator, currentValue ) => {
                    return accumulator + currentValue;
                });
            } else {
                return 0;
            }
        },
        grades( parent, args, ctx, info ) {
            return [ 89, 78, 99 ];
        },
        users( parent, args, { db }, info ) {
            return ( ! args.query )
                ? db.users
                : db.users.filter( ( user ) => {
                    return user.name.toLowerCase().includes( args.query.toLowerCase() );
                });
        },
        posts( parent, args, { db }, info ) {
            return ( ! args.query )
                ? db.posts
                : db.posts.filter( ( post ) => {
                    return ( post.title.toLowerCase().includes( args.query.toLowerCase() )  || post.body.toLowerCase().includes( args.query.toLowerCase() ) );
                });
        },
        comments( parent, args, { db }, info ) {
            return db.comments;
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
    },
    Mutation: {
        createUser( parent, args, { db }, info ) {
            const emailTaken = db.users.some( (user) => user.email === args.data.email );

            if( emailTaken ) {
                throw new Error( 'Email taken.' );
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            db.users.push( user );
            
            return user;
        },
        createPost( parent, args, { db }, info ) {
            const userExists = db.users.some( ( user ) => user.id === args.data.author );

            if( ! userExists ) {
                throw new Error( 'User not found' );
            }

            const post = {
                id: uuidv4(),
                ...args.data
            };

            db.posts.push( post );

            return post;

        },
        createComment( parent, args, { db }, info ) {
            const userExists = db.users.some( ( user ) => user.id === args.data.author );
            const postPublished = db.posts.some( ( post ) => ( post.id === args.data.post && post.published) );

            if( ! userExists || ! postPublished ) {
                throw new Error( 'Unable to find what you are looking for.' );
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            db.comments.push( comment );

            return comment;

        },
        deleteUser( parent, args, { db }, info ) {
            const userIndex = db.users.findIndex( ( user ) => user.id === args.id );

            if( userIndex === -1 ) {
                throw new Error( 'User not found.' );
            }

            const deletedUser = db.users.splice( userIndex, 1 );

            db.posts = db.posts.filter( ( post ) =>{
                const match = post.author === args.id;

                if( match ) {
                    db.comments = db.comments.filter( ( comment ) => comment.post !== post.id );
                }

                return !match;
            });

            return deletedUser[0];
        },
        deletePost( parent, args, { db }, info ) {
            const postIndex = db.posts.findIndex( ( post ) => post.id === args.id );

            if( postIndex === -1 ) {
                throw new Error( 'Post not found.' );
            }

            const deletedPost = db.posts.splice( postIndex, 1 );

            db.comments = db.comments.filter( ( comment ) => comment.post !== args.id );

            return deletedPost[0];
        },
        deleteComment( parent, args, ctx, info ) {
            const commentIndex = db.comments.findIndex( ( comment ) => comment.id === args.id );

            if( commentIndex === -1 ) {
                throw new Error( 'Comment not found.' );
            }

            return db.comments.splice( commentIndex, 1 )[0];

        },
    },
    Post: {
        author( parent, args, { db }, info ) {
            return db.users.find( ( user ) => {
                return user.id == parent.author;
            });
        },
        comments( parent, args, { db }, info ) {
            return db.comments.filter( ( comment ) => {
                return comment.post == parent.id;
            });
        },
    },
    User: {
        posts( parent, args, { db }, info ) {
            return db.posts.filter( ( post ) => {
                return post.author == parent.id;
            });
        },
        comments( parent, args, { db }, info ) {
            return db.comments.filter( ( comment ) => {
                return comment.author == parent.id;
            });
        },
    },
    Comment: {
        author( parent, args, { db }, info ) {
            return db.users.find( ( user ) => {
                return user.id == parent.author;
            });
        },
        post( parent, args, { db }, info ) {
            return db.posts.find( ( post ) => {
                return post.id == parent.post;
            });
        },
    },
};


// Creates the server.
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    },
});


// Starts the server.
server.start(() => {
    console.log('Server up!')
});

