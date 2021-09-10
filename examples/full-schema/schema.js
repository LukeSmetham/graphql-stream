import { createActivityFeedSchema } from '@stream-io/graphql-feeds';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
    region: 'us-east',
};

const config = {
    // Replace with your feed configs
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
            text: 'String',
            coverImage: 'String',
        },
    },
    credentials,
};

const schema = createActivityFeedSchema(config);

export default schema;
