import { v4 as uuidv4 } from 'uuid';

const Mutation = {
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
};

export { Mutation as default };