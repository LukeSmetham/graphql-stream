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

const { StreamUserFeedTC, StreamNotificationFeedTC, StreamUserTC, ...rest } = composeActivityFeed({
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
            feedGroup: 'timeline',
            type: 'aggregated',
        },
        {
            feedGroup: 'notification',
            type: 'notification',
        },
    ],
    collection: {
        name: 'post',
        fields: {
            text: 'String!',
            coverImage: 'String!',
        },
    },
    schemaComposer,
    credentials,
});

console.log(Object.keys(rest));
// Adding custom user data
// By default, the user data is of type JSON to allow any arbitrary data to be stored.
// You can provide your own type to the field like so: (See line#75-76 also)
const CustomUserDataTC = schemaComposer.createObjectTC({
    name: 'StreamCustomUserData', // Name here is arbitrary
    fields: {
        name: 'String!',
        email: 'String!',
    },
});

StreamUserTC.setField('data', {
    type: CustomUserDataTC,
});

// As an alternative here if you have existing user data elsewhere, e.g. with graphql-compose-mongoose, you could do
// something like the following, by overriding the data property to return your mongo document for the user.
// This removes the need to store anything more than the user id in Stream itself and auto-enriches your user data.
//
// StreamUserTC.addRelation('data', {
// 	prepareArgs: {
// 		_id: (source) => source.id,
// 	},
// 	projection: { id: true },
// 	resolver: () => YourMongoUserTC.mongooseResolvers.findById(),
// });

// Add everything to your schema
schemaComposer.Query.addFields({
    getUser: StreamUserTC.getResolver('getUser'),
    getOrCreateUser: StreamUserTC.getResolver('getOrCreateUser'),
    userFeed: StreamUserFeedTC.getResolver('getFeed'),
    notificationFeed: StreamNotificationFeedTC.getResolver('getFeed'),
});

schemaComposer.Mutation.addFields({
    addUser: StreamUserTC.getResolver('addUser').setArg('data', { type: CustomUserDataTC.getInputType() }), // getInputType will automatically create the input type for you (you can create a custom one too and set the type property to that instead)
    updateUser: StreamUserTC.getResolver('updateUser').setArg('data', { type: CustomUserDataTC.getInputType() }),
    removeUser: StreamUserTC.getResolver('removeUser'),
    addUserActivity: StreamUserFeedTC.getResolver('addActivity'),
    removeUserActivity: StreamUserFeedTC.getResolver('removeActivity'),
});

// TODO: Add example for optional context that we can auth the stream user from (i.e. emulate client side auth for protection against certain actions from the client)
const server = new ApolloServer({
    schema: schemaComposer.buildSchema(),
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
