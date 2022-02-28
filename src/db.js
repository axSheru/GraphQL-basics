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
        author: '1',
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

const db = {
    users,
    posts,
    comments,
};

export { db as default };