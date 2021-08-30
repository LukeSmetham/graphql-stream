import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { createActivityFeed } from '@graphql-stream/feeds';
import { schemaComposer } from 'graphql-compose';

import context from './context';

const { PORT = 8080 } = process.env;

// Adds the generated schema to an existing schemaComposer
// createActivityFeedsSchema(schemaComposer);

// Creates a standalone schema (useful if the implementing server doesn't use gql-compose.)
// const schema = createActivityFeedsSchema();

// Creates an activity feed, allows customization opts across multiple feeds.
schemaComposer.Query.addFields({
    userFeed: createActivityFeed({
        feedGroup: 'user',
        type: 'flat',
    }),
    timeline: createActivityFeed({
        feedGroup: 'timeline',
        type: 'aggregated',
        activityFields: {
            src: 'String!',
        },
    }),
});

const server = new ApolloServer({
    context,
    schema: schemaComposer.buildSchema(),
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
