import { ApolloServer } from 'apollo-server';
import { createStreamContext } from '@graphql-stream/shared';
import { schema } from '@graphql-stream/feeds';

const server = new ApolloServer({
    context: () => {
        return {
            stream: createStreamContext(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID),
        };
    },
    schema,
});

server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
});
