import { createActivityFeedSchema } from '@stream-io/graphql-feeds';
import { schemaComposer } from 'graphql-compose';

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
        },
    },
    schemaComposer,
    credentials,
};

createActivityFeedSchema(config);

const schema = schemaComposer.buildSchema();

export default schema;
