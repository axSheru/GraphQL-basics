const Query = {
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
};

export { Query as default };