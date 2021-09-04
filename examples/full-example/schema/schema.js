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
    userFeed: StreamUserFeedTC.getResolver('getFeed'),
    timeline: StreamTimelineFeedTC.getResolver('getFeed'),
    notificationFeed: StreamNotificationFeedTC.getResolver('getFeed'),
	login: UserTC.getResolver('login'),
});

const schema = schemaComposer.buildSchema();

export default schema;
