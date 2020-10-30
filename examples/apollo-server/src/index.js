import { ApolloServer } from 'apollo-server';
import { schema } from '@graphql-stream/feeds';

const server = new ApolloServer({
   schema,
});

server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
});
