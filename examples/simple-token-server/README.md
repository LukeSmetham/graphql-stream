# Simple Token Server

For every Stream Activity Feeds application, at a bare minimum you are required to set up a token endpoint on the server-side in order to return an authentication token to your users.

This project is a bare-bones example of the `@stream-io/graphql-feeds` setup, including just the `getToken` resolver in order for you to use GraphQL to query for your user tokens.

You can also use this project as a starting point with no assumptions made to your feed configurations or the shape of your collections.

## Includes

- Bare-bones `@stream-io/graphql-feeds` setup
- Token Endpoint for User Authentication
  - Helpful if you're starting a new project and want to use GraphQL on the backend, but are using one of our [Frontend SDKs](https://getstream.io/activity-feeds/sdk/).
- [Apollo Server](https://apollographql.com/)
- Subscription support with [`apollo-server-express`](https://www.npmjs.com/package/apollo-server-express).

### Getting Started

1. Run `yarn` in the root of the workspace.
2. Copy the `.env.example` file from the root of this project and rename it to `.env` - then fill out the variables with the values in the [Stream Dashboard](https://dashboard.getstream.io) for your application.
3. Run `yarn dev:token-server` from the root of the workspace
4. You can now view the Playground, powered by Apollo Studio, at [`http://localhost:8080`]
