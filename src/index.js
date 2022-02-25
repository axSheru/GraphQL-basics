import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Scalar types: String, Boolean, Int, Float, ID.

// Demo user data.
const users = [
    {
        id: '1',
        name: 'Alex',
        email: 'alex@test.com',
        age: 26
    },
    {
        id: '2',
        name: 'Andy',
        email: 'andy@test.com',
        age: 24
    },
    {
        id: '3',
        name: 'Laura',
        email: 'lau@test.com',
        age: 55
    },
];

// Demo posts data.
const posts = [
    {
        id: '1',
        title: 'Star Wars is back!',
        body: 'A new TV show will premiere soon.',
        published: true,
        author: '2',
    },
    {
        id: '2',
        title: 'Grogu is Yodas child?',
        body: 'They are the same color.',
        published: false,
        author: '3',
    },
    {
        id: '3',
        title: 'BS vs TVC',
        body: 'They both are amazing!',
        published: true,
        author: '2',
    },
];

// Demo comments data.
const comments = [
    {
        id: '1',
        text: 'Cal Kestis rules!',
        author: '1',
        post: '3',
    },
    {
        id: '2',
        text: 'Feel the force.',
        author: '3',
        post: '2',
    },
    {
        id: '3',
        text: 'Jedis are weak.',
        author: '3',
        post: '1',
    },
    {
        id: '4',
        text: 'Are there software developers in space?',
        author: '2',
        post: '2',
    },
];

// Type definition (Schema).
// The ! is to indicate it will allways be the return type value.
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add( a: Float!, b: Float! ): Float!
        add2( numbers: [Float!]! ): Float!
        grades: [Int!]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    },

    type Mutation {
        createUser( data: CreateUserInput! ) : User!
        createPost( data: CreatePostInput! ) : Post!
        createComment( data: CreateCommentInput! ) : Comment!
    },

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    },

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    },

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    },

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    },

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    },

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        users( parent, args, ctx, info ) {
            return ( ! args.query )
                ? users
                : users.filter( ( user ) => {
                    return user.name.toLowerCase().includes( args.query.toLowerCase() );
                });
        },
        posts( parent, args, ctx, info ) {
            return ( ! args.query )
                ? posts
                : posts.filter( ( post ) => {
                    return ( post.title.toLowerCase().includes( args.query.toLowerCase() )  || post.body.toLowerCase().includes( args.query.toLowerCase() ) );
                });
        },
        comments( parent, args, ctx, info ) {
            return comments;
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
        createUser( parent, args, ctx, info ) {
            const emailTaken = users.some( (user) => user.email === args.data.email );

            if( emailTaken ) {
                throw new Error( 'Email taken.' );
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            users.push( user );
            
            return user;
        },
        createPost( parent, args, ctx, info ) {
            const userExists = users.some( ( user ) => user.id === args.data.author );

            if( ! userExists ) {
                throw new Error( 'User not found' );
            }

            const post = {
                id: uuidv4(),
                ...args.data
            };

            posts.push( post );

            return post;

        },
        createComment( parent, args, ctx, info ) {
            const userExists = users.some( ( user ) => user.id === args.data.author );
            const postPublished = posts.some( ( post ) => ( post.id === args.data.post && post.published) );

            if( ! userExists || ! postPublished ) {
                throw new Error( 'Unable to find what you are looking for.' );
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            comments.push( comment );

            return comment;

        },
    },
    Post: {
        author( parent, args, ctx, info ) {
            return users.find( ( user ) => {
                return user.id == parent.author;
            });
        },
        comments( parent, args, ctx, info ) {
            return comments.filter( ( comment ) => {
                return comment.post == parent.id;
            });
        },
    },
    User: {
        posts( parent, args, ctx, info ) {
            return posts.filter( ( post ) => {
                return post.author == parent.id;
            });
        },
        comments( parent, args, ctx, info ) {
            return comments.filter( ( comment ) => {
                return comment.author == parent.id;
            });
        },
    },
    Comment: {
        author( parent, args, ctx, info ) {
            return users.find( ( user ) => {
                return user.id == parent.author;
            });
        },
        post( parent, args, ctx, info ) {
            return posts.find( ( post ) => {
                return post.id == parent.post;
            });
        },
    },
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

