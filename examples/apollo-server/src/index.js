import { ApolloServer } from 'apollo-server';
import { createFeedsContext, schema } from '@graphql-stream/feeds';

const server = new ApolloServer({
    context: () => {
        return {
            stream: {
                ...createFeedsContext(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID)
            },
        };
    },
    schema,
});

server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
});
