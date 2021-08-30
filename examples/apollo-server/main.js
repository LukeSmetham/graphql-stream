import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { createActivityFeed } from '@graphql-stream/feeds';
import { schemaComposer } from 'graphql-compose';

import context from './context';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID, PORT = 8080 } = process.env;

const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
};

// Adds the generated schema to an existing schemaComposer
// createActivityFeedsSchema(schemaComposer);

// Creates a standalone schema (useful if the implementing server doesn't use gql-compose.)
// const schema = createActivityFeedsSchema();

// Creates an activity feed, allows customization opts across multiple feeds.
schemaComposer.Query.addFields({
    userFeed: createActivityFeed(
        {
            feedGroup: 'user',
            type: 'flat',
        },
        credentials
    ),
    timeline: createActivityFeed(
        {
            feedGroup: 'timeline',
            type: 'aggregated',
            activityFields: {
                src: 'String!',
            },
        },
        credentials
    ),
});

const server = new ApolloServer({
    context,
    schema: schemaComposer.buildSchema(),
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
