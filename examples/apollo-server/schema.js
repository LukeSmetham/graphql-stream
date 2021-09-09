import { composeActivityFeed } from '@stream-io/graphql-feeds';
import { schemaComposer } from 'graphql-compose';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
    region: 'us-east',
};

const config = {
    feed: [
        {
            feedGroup: 'user',
            type: 'flat',
            activityFields: {
                // These fields are custom additions to the activity type from the Combase stream app as an example.
                text: 'String!',
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
    collection: [
        {
            name: 'post',
            fields: {
                text: 'String!',
                coverImage: 'String!',
            },
        },
    ],
    schemaComposer,
    credentials,
};

const { StreamUserFeedTC, StreamNotificationFeedTC, StreamUserTC, StreamPostEntityTC } = composeActivityFeed(config);

// Adding custom user data
// By default, the user data is of type JSON to allow any arbitrary data to be stored.
// You can provide your own type to the field like so: (See also line#79-80)
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

// Add everything to your schema
schemaComposer.Query.addFields({
    getPost: StreamPostEntityTC.getResolver('getEntity'),
    getUser: StreamUserTC.getResolver('getUser'),
    getOrCreateUser: StreamUserTC.getResolver('getOrCreateUser'),
    userFeed: StreamUserFeedTC.getResolver('getFeed'),
    notificationFeed: StreamNotificationFeedTC.getResolver('getFeed'),
});

schemaComposer.Mutation.addFields({
    addPost: StreamPostEntityTC.getResolver('addEntity'),
    updatePost: StreamPostEntityTC.getResolver('updateEntity'),
    removePost: StreamPostEntityTC.getResolver('removeEntity'),
    addUser: StreamUserTC.getResolver('addUser').setArg('data', { type: CustomUserDataTC.getInputType() }), // getInputType will automatically create the input type for you (you can create a custom one too and set the type property to that instead)
    updateUser: StreamUserTC.getResolver('updateUser').setArg('data', { type: CustomUserDataTC.getInputType() }),
    removeUser: StreamUserTC.getResolver('removeUser'),
    addUserActivity: StreamUserFeedTC.getResolver('addActivity'),
    addUserActivities: StreamUserFeedTC.getResolver('addActivities'),
    removeUserActivity: StreamUserFeedTC.getResolver('removeActivity'),
});

schemaComposer.Subscription.addFields({
    subscribeNotifications: StreamNotificationFeedTC.subscription,
});

const schema = schemaComposer.buildSchema();

export default schema;
