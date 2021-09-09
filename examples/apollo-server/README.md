# Apollo Server Example

This example project uses `@stream-io/graphql-feeds` with `graphql-compose` and Apollo Server to provide a more in-depth example of how to set up the two libraries in conjunction with each other.

## Getting Started

1. Run `yarn` in the root of the workspace.
2. Copy the `.env.example` file from the root of this project and rename it to `.env` - then fill out the variables with the values in the [Stream Dashboard](https://dashboard.getstream.io) for your application.
3. Set up the following feed groups in the [Stream Dashboard](https://dashboard.getstream.io)
    1. A `flat` feed, called `user`
    2. A `aggregated` feed, called `timeline`
    3. A `notification` feed, called `notification`
4. Run `yarn dev:apollo-server` from the root of the workspace.
5. You can now view the Playground, powered by Apollo Studio, at [`http://localhost:8080`] and begin making calls to your Stream Application.
