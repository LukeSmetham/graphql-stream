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
			activityFields: {
				text: 'String!'
			}
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
			
			rp.args.id =  new StreamID(`timeline:${user}`);

			return next(rp);
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
	follow: StreamUserFeedTC.getResolver('follow')
		.removeArg('feed')
		.removeArg('target')
		.addArgs({
			target: 'MongoID!'
		})
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			// Users will follow other users feeds, from their timeline feed.
			// This means their timeline will include all their followers activities too,
			// whereas user feeds will only include their own activities.
			rp.args = {
				feed: new StreamID(`timeline:${user}`),
				target: new StreamID(`user:${rp.args.target.toString()}`)
			};
			return next(rp);
		}),
	unfollow: StreamUserFeedTC.getResolver('unfollow')
		.removeArg('feed')
		.removeArg('target')
		.addArgs({
			target: 'MongoID!'
		})
		.wrapResolve(next => rp => {
			const { user } = rp.context;
			// Users will follow other users feeds, from their timeline feed.
			// This means their timeline will include all their followers activities too,
			// whereas user feeds will only include their own activities.
			rp.args = {
				feed: new StreamID(`timeline:${user}`),
				target: new StreamID(`user:${rp.args.target.toString()}`)
			};
			return next(rp);
		}),
	tweet: StreamUserFeedTC.getResolver('addActivity')
		.removeArg('feed')
		.removeArg('activity')
		.addArgs({
			text: 'String!',
		})
		.wrapResolve(next => rp => {
			// Ensures a user can only add to their own feed
			// by forcing the feed arg to be the user's feedId
			const { user } = rp.context;
			rp.args.feed = new StreamID(`user:${user}`);
			rp.args.activity = {
				actor: user,
				text: rp.args.text,
				object: user,
				verb: 'tweet',
				to: [new StreamID(`timeline:${user}`)] // Make sure the tweet appears in the user's timeline too. (Saves users having to follow their own user feed from their timeline.)
			};
			return next(rp);
		}),
	removeTweet: StreamUserFeedTC.getResolver('removeActivity')
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
