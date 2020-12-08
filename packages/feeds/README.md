# `@stream-io/graphql-feeds`
GraphQL Schema & Utils for Stream Feeds.

---

> ⚠️ Warning
> This lib is still in development and still considered a WIP.

Currently this library wraps the Stream JS SDK for Node. Still deciding on the best approach between that and directly wrapping the REST API using `phin` but ultimately the Schema syntax would be identical, just the implementation in the resolvers would change. 

--- 

## How To

The library can be used out of the box, as a standalone schema like so:

> The example uses `apollo-server` and is adapted from their basic example, however the schema can be used anywhere that is expecting a valid GQL schema.

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

This option is the quickest, easiest way to get a GQL server booted up with the feeds schema included and perfect to have a play around with the schema and see how things work. However, due to the high likely-hood of custom data in any given Stream app, the true usefulness of this library lies in either merging or stitching it with your own schema.

This allows you to create your own resolvers and types as you normally would, use any database you like, any other services etc. but allow your Stream data to become part of the same graph.

One example of how this works is, imagine your app creates activity feeds for sports games and you have a feed group named `matches`, and in your database you have documents with profile data for each team.

```gql
type Query {
    match(id: ObjectID!): StreamFlatFeed!
}
```

The above query `match` will return a `Match` object, which contains an array of team ids, start and end times, information on the stadium, and a `feed` that will call the underlying Stream Feeds schema and return the activities for this match.

Wherever you define your resolvers, you can implement the following:

```js
import { delegateToSchema } from '@graphql-tools/stitch';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';

export const Query = {
    match: (source, args, context, info) => {
        return delegateToSchema({
            args: { id: `matches:${args.id}` },
            context,
            fieldName: 'feed',
            info,
            operation: 'query',
            schema: streamFeeds,
        })
    }
}
```

By using the `delegateToSchema` method from `graphql-tools` - we can call the underlying feeds schema and optionally change the arguments before the are passed - in this case we force prepend the `matches` feed group slug as this resolver will only ever return feeds from this group. 

### TODO
- [] Context Explanation and Example
- [] Subscriptions