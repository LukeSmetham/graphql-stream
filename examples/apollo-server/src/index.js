import { ApolloServer } from 'apollo-server';
import { schema } from '@graphql-stream/feeds';
import { createStreamContext } from '@graphql-stream/shared';

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
