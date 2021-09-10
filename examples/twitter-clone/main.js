import 'dotenv/config';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';

import context from './context';
import schema from './schema';

const { MONGODB_URI, PORT = 8080 } = process.env;

// Connect to MongoDB (top-level await with esm/node 16 removes the need for IIFE/etc.)
await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Init Express App
const app = express();

// Init HTTP Server for Subscriptions
const httpServer = createServer(app);

// Init ApolloServer instance
const server = new ApolloServer({
    context,
    schema,
    plugins: [
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    },
                };
            },
        },
    ],
});

// Create a Subscription Server
const subscriptionServer = SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
    },
    {
        server: httpServer,
        path: server.graphqlPath,
    }
);

// Start the Apollo Server and apply the express app as middleware
await server.start();
server.applyMiddleware({ app });

// Start!
httpServer.listen(PORT, () => console.log(`🚀::${PORT}`));
