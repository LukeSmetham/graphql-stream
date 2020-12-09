# `@stream-io/graphql-feeds`
GraphQL Schema & Utils for Stream Feeds.

---

> ⚠️ Warning
> This lib is still in development.
> 
> Ultimately this library is young and a work-in-progress, developed alongside Combase to auto-generate activity feeds powered by Stream Chat webhooks & Mongo change streams. It's also not intended to be a _complete_ 'graphql client' for Stream Feeds, at least not at this point; Feed Activities, and especially Users and Collections, contain a lot of your own custom data making it hard to create "exact" types on our end. 
> 
> Because of this, the library is intended to be a set of base types, resolvers and utilities that you can utilize in your own api, schema/subschema etc. However best suits your use case. That being said, the schema is still exported as a complete, valid GraphQL schema that you can use out of the box - this can be great if you are using Stream for the first time. With the deploy to heroku button below, you can deploy a working Stream API with a documented GraphQL playground to try some queries, generate a token, create activities and learn how follow relationships work - visually. 
> 
> **Deploy to heroku button**
>
> Chat support is in the works too.

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

### Activities
The object and actor of the activity can be used in two ways; either embedding data in the activity and storing objects for these fields, or storing references to the "objects" that are stored elsewhere - either in Stream Collections, Mongo,  or any other data store/service.

Embedding data in activities is not recommended. The best approach is often to keep activities as light as possible and use references. The biggest advantage of this is being able to update the data in one place and have it update for all past, present and future activities.

>This concept of relations mixed with GraphQL allows Stream Feeds to become a "hub" of sorts, and create powerful personalized activity feeds & notification timelines from not only your own data, but from any datasource you can imagine - all in the same request.
>
>This also works bidirectionally. Here is a link to a blog post & example repo for using Algolia as a search engine, to return Stream Feed activities - you could also, for example, [Create or Extend Activity Types](#link-to-extending-types-stuff) to add a new field that takes in arguments to power your search, this would then call Algolia in it's resolver to return nested data within the parent type.

**Example**
```graphql
type Team {...}

type Stadium {...}

type Player {...}

type MatchActivity implements StreamActivity {
    teams: [Team!]
    stadium: Stadium!
    """
    Search the players that are playing in this match with Algolia, but return the Stream Feeds User objects.
    """
    players(query: String, filter: AlgoliaFilterInput, facet: AlgoliaFacetInput): [Player!] # <--- This field is GQL only, see resolver in the next block
    date: Date!
    verb: String
    actor: JSON!
    object: JSON!
}
```

However when using Stream Collections, you can optionally use the `enrich` flag when request activities. This will cause the ID to be replace with the full object. This is great when using Stream on the client side as it allows you to get everything you need in one request, but with GraphQL being strictly typed & a lot of the benefits of relationships combined with `Union`s and `Interfaces` it can be difficult to work out the best solution to extend the activity type. 

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
> The source object here is the original "untouched" StreamActivity response. We can access the object property in whatever shape it's in and use it to resolve our new document field.

With this in mind, combined with the ability to add anything that will run in Node to the datasources/resolver context - or stitch in any other GraphQL API - you can mesh together Stream Feeds with any other service, database, etc.

> You could also potentially use a "hybrid" approach for `object`, where you store a small object with key value pairs of identifiers for entities that relate to the activity in some way.

Some other options for extending the schema are:
- 

### README TODO
- [ ] Initializing Context
- [ ] Authentication
- [ ] Creating/Using Stream Tokens
- [ ] Extending/Implementing Types
- [ ] Stitching/Merging the Schema
- [ ] Subscriptions
- [ ] Road Map
- [ ] Publish & Link to the Subscriptions-based realtime, virtualized feed component.