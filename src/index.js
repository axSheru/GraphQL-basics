import { GraphQLServer } from 'graphql-yoga';

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
    },
    {
        id: '2',
        text: 'Feel the force.',
        author: '3',
    },
    {
        id: '3',
        text: 'Jedis are weak.',
        author: '3',
    },
    {
        id: '4',
        text: 'Are there software developers in space?',
        author: '2',
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
    },

    type Comment {
        id: ID!
        text: String!
        author: User!
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
    Post: {
        author( parent, args, ctx, info ) {
            return users.find( ( user ) => {
                return user.id == parent.author;
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

