import { composeActivityFeed } from '@graphql-stream/feeds';
import { schemaComposer } from 'graphql-compose';

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

// Add everything to your schema
schemaComposer.Query.addFields({
    timeline: StreamTimelineFeedTC.getResolver('getFeed')
		.removeArg('id')
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			rp.args.id = `timeline:${user}`;
			return next(rp);
		}),
    notificationFeed: StreamNotificationFeedTC.getResolver('getFeed')
		.removeArg('id')
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			rp.args.id = `notification:${user}`;
			return next(rp);
		}),
	login: UserTC.getResolver('login'),
	me: UserTC.getResolver('me'),
});

schemaComposer.Mutation.addFields({
	signup: UserTC.getResolver('signup'),
})

const schema = schemaComposer.buildSchema();

export default schema;
