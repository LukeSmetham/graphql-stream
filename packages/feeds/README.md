# GraphQL Stream Activity Feeds

This library wraps [Stream Activity Feeds](https://getstream.io/activity-feeds) REST API directly, to provide a fully-customizable GraphQL Schema built around your [Stream Activity Feeds](https://getstream.io/activity-feeds) apps.

If you're already using `graphql-compose` in your app, you can easily extend and customize the generated types and resolvers in order to add custom fields and relational data within your activity feeds.

If not, you can always import the full schema object and use this out-of-the-box, or merge together with an existing schema through something like [graphql-tools](https://www.graphql-tools.com/).

1. [Installation](#installation)
2. [How it works](#how-it-works)
3. [Usage](#usage)
    1. [composeActivityFeed](#composeactivityfeed)
    2. [Naming Conventions](#naming-conventions)
4. [Examples](#examples)

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

By passing an object representing your feed group setup to the schema builder exported from this library, you can automatically generate a valid schema that includes resolvers for following and unfollowing feeds, adding, updating and removing activities and reactions (like, comment, etc...) and using the Stream [Users](https://getstream.io/activity-feeds/docs/node/users_introduction/?language=javascript) and [Collections](https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=javascript) data stores.

Activity Feeds application often rely heavily on custom data; arbitrary extra fields added to activities that allow you store any JSON data you like in order to represent a particular activity.

Take for example a feed of videos posted by a user. The activities of your `video` feed group may include an `src` field containing a URL to the hosted video. By using `@stream-io/graphql-feeds` you can create "models" for your activities, making it even easier for developers on your project to get to grips with what data is expected for the different feeds and activities of your particular use-case - and even see these visually represented in your GraphQL IDE.

### A word on GraphQL Compose

Building with GraphQL Compose specifically, revolves mainly around an instance of a `SchemaComposer`. The `SchemaComposer` is essentially a store of all of your types, resolvers, scalars and directives that can be continually manipulated and programmatically generated, before eventually calling `schemaComposer.buildSchema()` which returns a standard `GraphQLSchema` object that you can use anywhere you would normally use a GraphQL Schema.

You don't have to fully understand GraphQL Compose in any way to make use of this library. Although to perform more complex customizations, reading [their documentation](https://graphql-compose.github.io/), as well as checking out our [examples](#examples), will definitely help.

## Usage

### `composeActivityFeed`

The first step to generating GraphQL Object Types & Resolvers for your Stream Feeds is to call `composeActivityFeed(options)`

The structure of the `options` object is as follows:

```ts
// Pseudo-code, the library is not currently written in typescript.
type StreamCredentialsMap = {
    api_key: string;
    api_secret: string;
    app_id: string;
    region?: string;
};

type FeedConfig = {
    feedGroup: string;
    type: 'flat' | 'aggregated' | 'notification';
    activityFields?: ObjectTypeComposerFieldConfigMapDefinition;
};
// For more information on ObjectTypeComposerFieldConfigMapDefinition, see here: https://graphql-compose.github.io/docs/api/ObjectTypeComposer.html#objecttypecomposerfieldconfigmapdefinition - You can define the additional custom fields of you activities the same way you would any other GQL Object Type - the same applies to collections as seen below.

type CollectionConfig = {
    name: string;
    fields: ObjectTypeComposerFieldConfigMapDefinition;
};

type Options = {
    feed: FeedConfig | [FeedConfig];
    collection: CollectionConfig | [CollectionConfig];
    schemaComposer?: SchemaComposer;
    credentials: StreamCredentialsMap;
};
```

Once you have constructed your options object, you can pass it to `composeActivityFeed` as below:

```js
import { composeActivityFeed } from '@stream.io/graphql-feeds';
import { schemaComposer } from 'graphql-compose';

const credentials = {
    api_key: 'YOUR_STREAM_API_KEY',
    api_secret: 'YOUR_STREAM_API_SECRET',
    app_id: 'YOUR_STREAM_APP_ID',
    region: 'eu-west',
};

const options = {
    feed: [
        {
            feedGroup: 'user',
            type: 'flat',
        },
        {
            feedGroup: 'timeline',
            type: 'aggregated',
        },
    ],
    collection: {
        name: 'post',
        fields: {
            text: {
                type: 'String!',
                description: 'The text content of the post',
            },
            coverImage: {
                type: 'String',
                description: 'An optional cover image for the post.',
            },
        },
    },
    credentials,
    schemaComposer,
};

const { StreamUserFeedTC, StreamTimelineFeedTC, StreamPostEntityTC } = composeActivityFeed(options);

// Add everything to the Schema:
schemaComposer.Query.addFields({
    userFeed: StreamUserFeedTC.getResolver('getFeed'),
    timeline: StreamTimelineFeedTC.getResolver('getFeed'),
    getPost: StreamPostEntityTC.getResolver('getEntity'),
});

schemaComposer.Mutation.addFields({
    addUserActivity: StreamUserFeedTC.getResolver('addActivity'),
});

const schema = schemaComposer.buildSchema();
```

The object returned from `composeActivityFeed` above contains the generated TypeComposers for your feeds and collections, and their resolvers.

###  Naming Conventions

Type names are automatically generated based on your configuration objects, as explained below:

#### Feeds

To generate type names for your Feed ObjectTypes, the library takes the `feedGroup` property of each feed configuration object you pass in, and runs a method similar to the below:

```js
const { feed } = options;
const typeName = `Stream${capitalize(feed.feedGroup)}Feed`;
```

i.e. if your `feedGroup` is `user` the outputted TypeComposer will be `StreamUserFeed`.

Activity types are unique to each feed, and are created in the same way. If your `feedGroup` is `user` the outputted Activity type will be names `StreamUserActivity`.

#### Collections

Similarly to [feeds](#feeds), the collection types take the `name` value from your configuration object provided to `options` and run a method similar to the below:

```js
const { collection } = options;
const typeName = `Stream${capitalize(collection.name)}Entity`; // The collection query resolvers return CollectionEntities that contain a data property with actual collection item embedded.
const dataTypeName = `Stream${capitalize(collection.name)}`; // This will be the type of the `data` field of the CollectionEntity.
```

> As with everything in this guide, the best way to learn is to spin up one of the `example` projects in this repo and check out the GraphQL playground to visually see the types and resolvers that are generated.

## Examples
