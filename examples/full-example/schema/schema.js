import { composeActivityFeed } from '@graphql-stream/feeds';
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
});

const schema = schemaComposer.buildSchema();

export default schema;
