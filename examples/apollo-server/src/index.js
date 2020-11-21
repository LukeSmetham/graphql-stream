import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createStreamContext } from '@graphql-stream/shared';

import schema from './schema';

const server = new ApolloServer({
    context: ({ connection, req }) => {
        let token;
        let streamUserId;

        if (connection) {
            token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
        } else {
            token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
        }

        if (token) {
            const { user_id } = jwt.verify(token, process.env.STREAM_SECRET);

            streamUserId = user_id;
        }

        return {
            /*
             * The following will scope all requests to the current user (same behaviour as the client-side client)
             * stream: createStreamContext(process.env.STREAM_KEY, token || process.env.STREAM_SECRET, process.env.STREAM_ID),
             */

            // The following will allow the user to use the full server client, this is most suitable if you're heavily extending the schema so you can implement your own authentication logic using the streamUserId
            stream: createStreamContext(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID),
            streamUserId,
        };
    },
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
