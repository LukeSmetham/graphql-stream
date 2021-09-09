# GraphQL Stream Activity Feeds

This library wraps [Stream Activity Feeds](https://getstream.io/activity-feeds) REST API directly, to provide a fully-customizable GraphQL Schema built around your [Stream Activity Feeds](https://getstream.io/activity-feeds) apps.

If you're already using `graphql-compose` in your app, you can easily extend and customize the generated types and resolvers in order to add custom fields and relational data within your activity feeds.

If not, you can always import the full schema object and use this out-of-the-box, or merge together with an existing schema through something like [graphql-tools](https://www.graphql-tools.com/).

1. [Installation](#installation)
2. [How it works](#how-it-works)
3. [Examples](#examples)

## Installation

Begin by installing the library to your project:

```sh
yarn add @stream-io/graphql-feeds
```

The library lists `graphql` and `graphql-compose` as `peerDependencies`, so these modules should be explicitly installed within your app.

```sh
yarn add graphql graphql-compose
```

> Note: You do not need to use `graphql-compose` within your application to benefit from `@stream-io/graphql-feeds` although it will be used under-the-hood to create the schema that your app consumes.

## How it works

Every Stream Activity Feeds application contains an arbitrary number of [Feed Groups](https://getstream.io/activity-feeds/docs/node/creating_feeds/?language=javascript), configured by you, that represent the types of feed in your app.

By passing an object representing your feed group setup to the schema builder exported from this library, you can automatically generate a valid schema that includes resolvers for following and unfollowing feeds, adding, updating and removing activities and reactions (like, comment, etc...) and using Stream [Users](https://getstream.io/activity-feeds/docs/node/users_introduction/?language=javascript) and [Collections](https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=javascript) data stores.

Activity Feeds application often rely heavily on custom data; arbitrary extra fields added to activities that allow you store any JSON data you like in order to represent a particular activity. Take for example a feed of videos posted by a user. The activities of your `video` feed group may include an `src` field containing a URL to the hosted video. By using `@stream-io/graphql-feeds` you can create "models" for your activities, making it even easier for developers on your project to get to grips with what data is expected for the different feeds and activities of your particular use-case - and even see these visually represented in your GraphQL IDE.

Building with GraphQL Compose specifically, revolves mainly around an instance of a `SchemaComposer`. The `SchemaComposer` is essentially a store of all of your types, resolvers, scalars and directives that can be continually manipulated and programmatically generated, before eventually calling `schemaComposer.buildSchema()` which returns a standard `GraphQLSchema` object that you can use anywhere you would normally use a GraphQL Schema.

You don't have to fully understand GraphQL Compose in any way to make use of this library. Although to perform more complex customizations, reading [their documentation](https://graphql-compose.github.io/), as well as checking out our [examples](#examples), will definitely help.

## Examples
