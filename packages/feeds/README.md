# GraphQL Stream Activity Feeds

This library wraps [Stream Activity Feeds](https://getstream.io/activity-feeds) REST API directly, to provide a fully-customizable GraphQL Schema built around your [Stream Activity Feeds](https://getstream.io/activity-feeds) apps.

If you're already using `graphql-compose` in your app, you can easily extend and customize the generated types and resolvers in order to add custom fields and relational data within your activity feeds.

If not, you can always import the full schema object and use this out-of-the-box, or merge together with an existing schema through something like [graphql-tools](https://www.graphql-tools.com/).

## Installation

Begin by installing the library to your project:

```sh
yarn add @stream-io/graphql-feeds
```

The library lists `graphql` and `graphql-compose` as `peerDependencies`, so these modules should be explicitly installed within your app.

```sh
yarn add graphql graphql-compose
```

## How it works

## Examples
