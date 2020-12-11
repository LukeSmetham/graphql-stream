# `@stream-io/graphql-feeds`
GraphQL Schema & Utils for Stream Feeds.

---

> ⚠️ Warning
> This lib is still in development.
> 
> Ultimately this library is young and a work-in-progress, developed alongside Combase to auto-generate activity feeds powered by Stream Chat webhooks & Mongo change streams. It's also not intended to be a _complete_ 'graphql client' for Stream Feeds, at least not at this point; Feed Activities, and especially Users and Collections, contain a lot of your own custom data making it hard to create "exact" types on our end. 
> 
> Because of this, the library is intended to be a set of base types, resolvers and utilities that you can utilize in your own api, schema/subschema etc. However best suits your use case. That being said, the schema is still exported as a complete, valid GraphQL schema that you can use out of the box - this can be great if you are using Stream for the first time. With the snippet below you can run a working Stream API with a documented GraphQL playground to try some queries, generate a token, create activities and learn how follow relationships work. 
>
> Chat support is in the works too.

Currently this library wraps the Stream JS SDK for Node. Current avaluation options and working on a version based on RESTDataSource to dedupe requests

--- 

## How To

The library can be used out of the box, as a standalone schema like so:

### `apollo-server`
Simplest way to get started.

```sh
#   Assumes you already have babel set up.
$   yarn add apollo-server @stream-io/graphql-feeds
```

```js
import { ApolloServer, gql } from 'apollo-server';
import { schema } from '@stream-io/graphql-feeds';

const server = new ApolloServer({
    schema,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

```

### `apollo-server-express`
Allows you to use other endpoints for webhooks etc.
Example also includes set up with [Apollo Server Express](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#subscriptions-with-additional-middleware) to support Subscriptions.

```js
import http from 'http';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { schema } from '@stream-io/graphql-feeds';

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});

```

This option is the quickest, easiest way to get a GQL server booted up with the feeds schema included and perfect to have a play around with the schema and see how things work. However, due to the high likely-hood of custom data in any given Stream app, the true usefulness of this library lies in either merging or stitching it with your own schema.

By passing the schema and no other resolvers, typeDefs or additional schemas you are limited to the type definitions and resolvers that are included with the library with no additional functionality at all. 

Because the library is designed to be extended there are a few types and fields that aren't best suited to be used out of the box. One example of this is with activities - the chances are high that any given feed activity has a reference to an object either in a stream collection or another data store.

### Activities
The `object` and `actor` of the activity can be used in two primary ways; either embedding data in the activity and storing objects in these fields, or storing references to data that is stored elsewhere.

Embedding data in activities is not recommended. The best approach is to keep activities as light as possible and use references. The biggest advantage of this is being able to update the data in one place and have it update for all past, present and future activities.

>This concept of relations mixed with GraphQL allows Stream Feeds to become a "hub" of sorts, creating powerful personalized activity feeds & notification timelines from not only your own data, but from any datasource you can think of.
>
>This also works bidirectionally. Here is a link to a [blog post]() w/ example repo for using Algolia as a search engine, to return Stream Feed activities. The article also covers adding a new custom field to the `StreamFlatFeed` type to add a "feed-scoped" search using the same technique.

**Custom Activity Example**
```graphql
type Team {...}

type Stadium {...}

type Player {...}

type MatchActivity implements StreamActivityInterface {
    teams: [StreamID!]
    stadium: UUID!
    """
    Search the players that are playing in this match with Algolia, but return the Stream Feeds User objects.
    """
    players(query: String, filter: AlgoliaFilterInput, facet: AlgoliaFacetInput): [Player!]
    date: Date!
    verb: String
    actor: JSON!
    object: JSON!
}
```

However when using Stream Collections, you can optionally use the `enrich` flag when request activities. This will cause the ID to be replaced with the full object. This is great when using Stream on the client side as it allows you to get everything you need in one request, but with GraphQL being strictly typed & a lot of the benefits of relationships combined with `Union`s and `Interfaces` it can be difficult to work out the best solution to extend the activity type. 

Ultimately you can always do 
```js
import { SchemaComposer } from 'graphql-compose';
import { schema } from '@stream-io/graphql-feeds';

const schemaComposer = new SchemaComposer(feedsSchema);
```
in your api and bend the types in any way you see fit. But this can feel like overkill in a more simple use case.

Because of this the `actor` and `object` fields are currently defined as `JSON` in the schema. 

`JSON` can also be a `String` with this Scalar. So this has been the easiest way so far to allow any kind of data in these fields and still allow both Stream-based enrichment & relationships if they happen to by foreign ids etc.

Because `object` & `actor` are required in your activities, it's best to have them in the schema to ensure proper validation - but this means the type cannot be easily changed on the fly without something like `graphql-compose` to change the expected field type, or writing a custom activity type.

One way to extend is as follows:

In your type defs:
```graphql
type Document {
    id: String!
    text: JSON!
    createdAt: Date!
    updatedAt: Date!
}

extend type StreamActivity {
    document: Document!
}
```
> We add a new field, `document` that is graphql only. Only defined in the type definitions at this point. 

Then in your resolvers, you can teach it how to return data by defining a resolver for the `document` field within the `StreamActivity` root type.
```js
const resolvers = {
    Mutation: {...},
    Query: {...},
    StreamActivity: {
        document: (source, args, context, info) => {
            const id = source.object;
            return context.collections.Document.findById(id);
        },
    }
};
```
> The source object here is the original "untouched" StreamActivity response. We can therefore access the original `object` property (even though it doesn't initially meet the expected type in our schema) and use it to resolve our new `document` field.

With this in mind, combined with the ability to add almost anything to the datasources/resolver context - or stitch in any other GraphQL API - you can mesh together Stream Feeds with any other service, database, etc. One interesting example of this in the real-world is how `gatsby-source-filesystem` uses `graphql-compose` and Node's `fs` package to build out Types based on the files and folder structure at the path you give to it.

> You could also potentially use a "hybrid" approach for `object`, where you store a small object with key value pairs of identifiers for entities that relate to the activity in some way.

## StreamID
`StreamID` is a custom Scalar type that represents a feed, channel or collection entry in a Stream app. 

`timeline:user_id`
`messaging:channel_id`
`post:post_id`

The above relate to a `feed` `channel` and `collection` respectively, each one defining its 'type' (be it a feed group, channel type, or collection name) and ID, colon-seprated. When using the Feeds schema in your API, any field with type `StreamID` will resolve to a string as above when it reaches the client.

When using a `StreamID` as an argument, you can also pass a colon-separated string, but once GraphQL parses it, it becomes a `StreamID` instance. 

`StreamID` extends the default JavaScript `Array` class, and adds some functionality such as getters for `together` `type` and `id`; to return the parts individually, or without the colon to aid in generating a signing signature for the underlying Stream Activity Feeds REST API.

This means it can also be structured, or spread, as with a standard `Array`

For Example, in the `activities` resolver where the `feed` argument is a `StreamID`:

```js
const activities = (source, args, context, info) => {
    const { stream } = context;
    const feed = stream.feeds.feed(...args.feed);
    // ...
};
```

You could also do this: 
```js
const activities = (source, args, context, info) => {
    const { stream } = context;
    const [feedGroup, feedId] = args.feed;
    //... 
};
```


### README TODO
- [ ] Initializing Context
- [ ] Authentication
- [ ] Creating/Using Stream Tokens
- [ ] Extending/Implementing Types
- [ ] Stitching/Merging the Schema
- [ ] Subscriptions
- [ ] Road Map
- [ ] Publish & Link to the Subscriptions-based realtime, virtualized feed component for `@apollo/client`