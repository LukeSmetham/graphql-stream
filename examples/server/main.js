import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { schema } from '@stream-io/graphql-feeds';

import context from './context';

const { PORT = 8080 } = process.env;

const server = new ApolloServer({
    context,
    schema,
});

server.listen(PORT);

// eslint-disable-next-line no-console
console.log('🚀::8080');
