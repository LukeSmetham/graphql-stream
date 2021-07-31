import { ApolloServer } from 'apollo-server';
import { schema } from '@stream-io/graphql-feeds';

const server = new ApolloServer({
    schema,
});

const { PORT = 8080 } = process.env;

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
