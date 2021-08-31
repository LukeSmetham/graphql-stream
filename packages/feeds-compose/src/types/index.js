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

const createActivityFeed = (opts = {}, credentials) => {
    const schemaComposer = opts.schemaComposer || composer;

    if (!opts.feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    ensureScalars(schemaComposer);

    // TODO?: Add Interfaces for feed and activity.
    // Create interface types
    createActivityInterfaces(schemaComposer);

    // Add some additional options to the opts parameter
    const options = {
        ...opts,
        schemaComposer,
        feedGroupName: capitalize(opts.feedGroup),
    };

    const FeedTC = createFeed(options, credentials);
    const ActivityTC = createActivity(options, credentials);
    const GroupedActivityTC = createGroupedActivity(ActivityTC, options);

    FeedTC.activityFeedResolvers = {
        getFeed: () => getFeed(FeedTC, credentials),
        followFeed: () => followFeed(FeedTC, credentials),
        unfollowFeed: () => unfollowFeed(FeedTC, credentials),
        getActivities: () => getActivities(GroupedActivityTC ?? ActivityTC, credentials),
        addActivity: () => addActivity(ActivityTC, credentials),
        addActivities: () => addActivities(ActivityTC, credentials),
        // updateActivity: () => 'Stream',
        removeActivity: () => removeActivity(ActivityTC, credentials),
        // addReaction: () => 'Stream',
        // updateReaction: () => 'Stream',
        // removeReaction: () => 'Stream',
        // getReactions: () => 'Stream',
        // addUser: () => 'Stream',
        // updateUser: () => 'Stream',
        // removeUser: () => 'Stream',
        // getUser: () => 'Stream',
        // getOrCreateUser: () => 'Stream',
        // TODO: Collections
    };

    FeedTC.addRelation('activities', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.activityFeedResolvers.getActivities(),
        description: 'Get the list of activities for this feed',
    });

    FeedTC.addRelation('follow', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.activityFeedResolvers.followFeed(),
        description: '[MUTATION] Follow a feed.',
    });

    FeedTC.addRelation('unfollow', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.activityFeedResolvers.unfollowFeed(),
        description: '[MUTATION] Unfollow a feed.',
    });

    return {
        FeedTC,
        ActivityTC,
        GroupedActivityTC,
    };
};

export { createActivityFeed };
