import { composer } from 'schema';
import capitalize from 'capitalize';

import { JSONResolver, UUIDResolver } from 'graphql-scalars';
import { StreamIDResolver } from 'scalars';

import { createFeed } from './Feed';
import { createActivity, createGroupedActivity } from './Activity';

import { createActivityInterfaces } from 'interfaces/Activity';

import { getFeed, followFeed, unfollowFeed } from './Feed/resolvers';
import { getActivities, addActivity, addActivities, removeActivity } from './Activity/resolvers';

/**
 * Ensures the schema composer contains the required schemas we need to create Stream types & resolvers.
 * @param {SchemaComposer} schemaComposer
 */
const ensureScalars = schemaComposer => {
    if (!schemaComposer.has('JSON')) {
        schemaComposer.add(JSONResolver);
    }

    if (!schemaComposer.has('StreamID')) {
        schemaComposer.add(StreamIDResolver);
    }

    if (!schemaComposer.has('UUID')) {
        schemaComposer.add(UUIDResolver);
    }
};

const createActivityFeed = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;

    if (!opts.feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    ensureScalars(schemaComposer);

    // Create interface types
    createActivityInterfaces(schemaComposer);

    // Add some additional options to the opts object
    const options = {
        ...opts,
        schemaComposer,
        feedGroupName: capitalize(opts.feedGroup),
    };

    // Create TypeComposers
    const FeedTC = createFeed(options);
    const ActivityTC = createActivity(options);
    const GroupedActivityTC = createGroupedActivity(ActivityTC, options);

    // TODO: Collection resolvers
    // TODO: Subscription resolvers
    // Create the final data object returned from createActivityFeed
    const data = {
        FeedTC,
        ActivityTC,
        GroupedActivityTC,
        query: {
            getFeed: () => getFeed(FeedTC, opts),
            getActivities: () => getActivities(GroupedActivityTC ?? ActivityTC, opts),
            // getUser: () => 'Stream',
            // getOrCreateUser: () => 'Stream',
            // getReactions: () => 'Stream',
        },
        mutation: {
            followFeed: () => followFeed(FeedTC, opts),
            unfollowFeed: () => unfollowFeed(FeedTC, opts),
            addActivity: () => addActivity(ActivityTC, opts),
            addActivities: () => addActivities(ActivityTC, opts),
            removeActivity: () => removeActivity(ActivityTC, opts),
            // updateActivity: () => 'Stream',
            // addReaction: () => 'Stream',
            // updateReaction: () => 'Stream',
            // removeReaction: () => 'Stream',
            // addUser: () => 'Stream',
            // updateUser: () => 'Stream',
            // removeUser: () => 'Stream',
        },
        subscription: {},
    };

    // Add the activities field to the FeedTC here as we need the ActivityTC or GroupedActivityTC to be created first.
    // Doing it via a relation allows us to re-use the same resolver we use for fetching just the activities without other feed fields
    FeedTC.addRelation('activities', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => data.query.getActivities(),
        description: 'Get the list of activities for this feed',
    });

    return data;
};

export { createActivityFeed };
