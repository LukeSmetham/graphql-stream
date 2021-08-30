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
    region: 'us-east',
};

schemaComposer.Query.addFields({
    feed: createActivityFeed(
        {
            feedGroup: 'user',
            type: 'flat',
            activityFields: {
                // These fields are custom additions to the activity type from the Combase stream app as an example.
                text: 'String!',
                entity: 'String!',
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
