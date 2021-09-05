import { composeActivityFeed, StreamID } from '@graphql-stream/feeds';
import { deepmerge, schemaComposer } from 'graphql-compose';

import { UserTC } from './types';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

// Stream Credentials
const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
    region: 'us-east',
};

// Translate your feed configs from the Stream Dashboard into the below structure.
const config = {
    feed: [
        {
            feedGroup: 'user',
            type: 'flat',
            activityFields: {
                text: 'String!',
            },
        },
        {
            feedGroup: 'timeline',
            type: 'flat',
        },
        {
            feedGroup: 'notification',
            type: 'notification',
        },
    ],
    schemaComposer,
    credentials,
};

// Create activity feeds from the config
const { 
	StreamUserFeedTC,
	StreamTimelineFeedTC,
	StreamNotificationFeedTC,
} = composeActivityFeed(config);

// Add everything resolvers to the schema
schemaComposer.Query.addFields({
    timeline: StreamTimelineFeedTC.getResolver('getFeed')
		.removeArg('id')
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			const newRp = deepmerge(rp, {
				args: {
					id: new StreamID(`timeline:${user}`)
				}
			});
			return next(newRp);
		}),
    notifications: StreamNotificationFeedTC.getResolver('getFeed')
		.removeArg('id')
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			rp.args.id = new StreamID(`notification:${user}`);
			return next(rp);
		}),
	login: UserTC.getResolver('login'),
	me: UserTC.getResolver('me'),
});

schemaComposer.Mutation.addFields({
	tweet: StreamUserFeedTC.getResolver('addActivity')
		.removeArg('feed')
		.wrapResolve(next => rp => {
			// Ensures a user can only add to their own feed
			// by forcing the feed arg to be the user's feedId
			const { user } = rp.context;
			rp.args.feed = new StreamID(`user:${user}`);
			return next(rp);
		}),
	signup: UserTC.getResolver('signup'),
})

const schema = schemaComposer.buildSchema();

export default schema;
