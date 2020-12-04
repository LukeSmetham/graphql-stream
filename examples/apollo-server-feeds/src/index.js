import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import { createStreamContext } from '@graphql-stream/shared';

import schema from './schema';

const server = new ApolloServer({
    context: () => ({
        stream: createStreamContext(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID),
    }),
    schema,
});

const app = express();

server.applyMiddleware({
    app,
});

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(4000, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    // eslint-disable-next-line no-console
    console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
});