import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { createFeedsContext, schema } from '@stream-io/graphql-feeds';

const { PORT = 8080, STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

const server = new ApolloServer({
    context: () => {
        return {
            stream: createFeedsContext(STREAM_KEY, STREAM_SECRET, STREAM_ID),
        };
    },
    schema,
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
