import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { composeActivityFeed } from '@graphql-stream/feeds';
import { schemaComposer } from 'graphql-compose';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID, PORT = 8080 } = process.env;

const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
    region: 'us-east',
};

const { feeds, users } = composeActivityFeed({
    feed: [
        {
            feedGroup: 'user',
            type: 'flat',
            activityFields: {
                // These fields are custom additions to the activity type from the Combase stream app as an example.
                text: 'String!',
                entity: 'String!',
            },
        },
        {
            feedGroup: 'notification',
            type: 'notification',
            activityFields: {
                // These fields are custom additions to the activity type from the Combase stream app as an example.
                text: 'String!',
                entity: 'String!',
            },
        },
    ],
    schemaComposer,
    credentials,
});

schemaComposer.Query.addFields({
    getUser: users.query.getUser(),
    userFeed: feeds.userFeed.query.getFeed(),
    notificationFeed: feeds.notificationFeed.query.getFeed(),
});

schemaComposer.Mutation.addFields({
    addUser: users.mutation.addUser(),
    addUserActivity: feeds.userFeed.mutation.addActivity(),
    removeUserActivity: feeds.userFeed.mutation.removeActivity(),
});

// TODO: Add example for optional context that we can auth the stream user from (i.e. emulate client side auth for protection against certain actions from the client)
const server = new ApolloServer({
    schema: schemaComposer.buildSchema(),
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
