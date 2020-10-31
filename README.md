# `graphql-stream`
GraphQL Stream offers a set of tools, utils and extendable Schemas, Types, Resolvers and more, to easily spin up a Stream Powered GraphQL API in seconds -- or stitch, extend, and merge into your existing API to allow your Stream Chat and Stream Feeds data to directly integrate to any existing remote or local GraphQL schema.

- Can talk Directly to Apollo client in React, no API required.
- Tree-Shakeable, Modularized & Composable Schema files giving you ultimate flexibility to, mix, match and extend types, include just Feeds or just Chat, include both, use the schema as a standalone API in its own right, or throw away our resolver entirely to construct totally custom logic using the Types and Resolver Context providers. 

TODO: Most of the below info has changed slightly.

### Feeds

#### Retrieving Feeds
There are three main feed groups in any Stream application. It is entirely up to the developer which types to utilize, and when. Because of this, as with all `graphql-stream` modules, the library provides base types that can be combined in any way you see fit.



The `feed` Query resolver can return activities for all feed groups, `flat`, `aggregated` and `notification`.

> There are also `flatFeed` `aggregatedFeed` and `notificationFeed` Query resolvers to return a specific feed group, to offer simpler querying if you know the feed group ahead of time.

By including the type name, you will receive the type of Activity in your response. All Activities inherit from the `BaseActivity` interface and a `flat` feed group returns these as a flat array.

If you enter the `slug` and `id` for a `notification` or `aggregated` feed, the `Activity` items are stored on the `result.activities` property alongside special, aggregation specific information like `group`, `activity_count` and `is_seen`/`is_read` for `notification` feeds.

> For the examples below, let's imagine we have 3 feed groups, `timeline` for users activities (Flat), `organization_timeline` to show a rollup of org-wide activity (Aggregated) and a `notification` feed for notifying users about things (Notification).

**All Feed Groups**

```graphql
{
	feed(slug:"any_feed_slug", id:"any_feed_id") {
		__typename
		...ActivityFields
		...AggregatedEvents
		...NotificationEvents
	}
}

fragment ActivityFields on Activity {
	id
	verb
	actor
	object
}

fragment AggregatedEvents on AggregatedActivity {
	activities {
		...ActivityFields
	}
	verb
	group
}

fragment NotificationEvents on NotificationActivity {
	activities {
		...ActivityFields
	}
	verb
	group
	is_seen
	is_read
}
```

**Flat Feed**
```graphql
{
	flatFeed(slug:"timeline", id:"00000000000") {
		verb
		object
		actor
		id
	}
}

# OR 

{
  feed(slug:"timeline", id:"00000000000") {
		... on Activity {
			verb
			object
			actor
			id
		}
	}
}
```

**Aggregated Feed**
```graphql
{
	aggregatedFeed(slug:"timeline", id:"00000000000") {
		activities {
			verb
			object
			actor
			id
		}
		group
		id
		activity_count
	}
}

# OR

{
  feed(slug:"organization_timeline", id:"00000000000") {
		... on AggregatedActivity {
			activities {
				...ActivityFields
			}
			group
			id
			activity_count
		}
	}
}

fragment ActivityFields on Activity {
	verb
	object
	actor
	id
}
```

**Notification Feed**
```graphql
{
	notificationFeed(slug:"timeline", id:"00000000000") {
		activities {
			verb
			object
			actor
			id
		}
		group
		id
		activity_count
	}
}

# OR 

{
  feed(slug:"notification", id:"00000000000") {
		... on NotificationFeed {
			activities {
				...ActivityFields
			}
			group
			id
			activity_count
			is_seen
			is_read
		}
	}
}

fragment ActivityFields on Activity {
	verb
	object
	actor
	id
}
```