import 'dotenv/config';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const { PORT = 8080 } = process.env;

const app = express();

const httpServer = createServer(app);

// TODO: Add example for optional context that we can auth the stream user from (i.e. emulate client side auth for protection against certain actions from the client)
const server = new ApolloServer({
    schema,
	plugins: [{
		async serverWillStart() {
		  return {
			async drainServer() {
			  subscriptionServer.close();
			}
		  };
		}
	  }],
});

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

await server.start();

server.applyMiddleware({ app });

httpServer.listen(PORT, () =>
	console.log(`🚀::${PORT}`)
);
