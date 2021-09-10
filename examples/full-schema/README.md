# Full Schema Example

This project shows how to use the Full Schema export from `@stream-io/graphql-feeds`. Using this method, all resolver and types will be indlucded in you schema without the need to touch `graphql-compose`.

### Getting Started

1. Run `yarn` in the root of the workspace.
2. Copy the `.env.example` file from the root of this project and rename it to `.env` - then fill out the variables with the values in the [Stream Dashboard](https://dashboard.getstream.io) for your application.
3. In its current state, this example makes some assumptions on the feed groups and collection models in your app. Either create the following feed groups, or [change the configuration object here](./schema.js#13) to match your app.
   - a `flat` feed called `user`
   - a `aggregated` feed called `timeline`
   - a `notification` feed called `notification`
4. Run `yarn dev:token-server` from the root of the workspace
5. You can now view the Playground, powered by Apollo Studio, at [`http://localhost:8080`]
