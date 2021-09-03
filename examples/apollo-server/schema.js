import { composeActivityFeed, FeedSubscription } from '@graphql-stream/feeds';
import { schemaComposer } from 'graphql-compose';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID, PORT = 8080 } = process.env;

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
    collection: [
        {
            name: 'post',
            fields: {
                text: 'String!',
                coverImage: 'String!',
            },
        },
        {
            name: 'video',
            fields: {
                description: 'String!',
                src: 'String!',
            },
        },
    ],
    schemaComposer,
    credentials,
};

const { StreamUserFeedTC, StreamNotificationFeedTC, StreamUserTC, StreamPostEntityTC, StreamVideoEntityTC } = composeActivityFeed(config);

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
    getPost: StreamPostEntityTC.getResolver('getEntity'),
    getVideo: StreamVideoEntityTC.getResolver('getEntity'),
    getUser: StreamUserTC.getResolver('getUser'),
    getOrCreateUser: StreamUserTC.getResolver('getOrCreateUser'),
    userFeed: StreamUserFeedTC.getResolver('getFeed'),
    notificationFeed: StreamNotificationFeedTC.getResolver('getFeed'),
});

schemaComposer.Mutation.addFields({
    addPost: StreamPostEntityTC.getResolver('addEntity'),
    updatePost: StreamPostEntityTC.getResolver('updateEntity'),
    removePost: StreamPostEntityTC.getResolver('removeEntity'),
    addVideo: StreamVideoEntityTC.getResolver('addEntity'),
    updateVideo: StreamVideoEntityTC.getResolver('updateEntity'),
    removeVideo: StreamVideoEntityTC.getResolver('removeEntity'),
    addUser: StreamUserTC.getResolver('addUser').setArg('data', { type: CustomUserDataTC.getInputType() }), // getInputType will automatically create the input type for you (you can create a custom one too and set the type property to that instead)
    updateUser: StreamUserTC.getResolver('updateUser').setArg('data', { type: CustomUserDataTC.getInputType() }),
    removeUser: StreamUserTC.getResolver('removeUser'),
    addUserActivity: StreamUserFeedTC.getResolver('addActivity'),
    removeUserActivity: StreamUserFeedTC.getResolver('removeActivity'),
});

schemaComposer.Subscription.addFields({
    subscribeUserFeed: {
		name: 'subscribeFeed',
		type: 'JSON',
		args: { id: 'StreamID!' },
		resolve: data => data,
		subscribe: (_, args) => {
			return new FeedSubscription(credentials).asyncIterator(args.id.together)
		}
	},
});

const schema = schemaComposer.buildSchema();

export default schema;