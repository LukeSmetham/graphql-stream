import { composer } from 'schema';
import { camelCase } from 'graphql-compose';
import capitalize from 'capitalize';
import castArray from 'lodash.castarray';

import { createFeed } from 'types/Feed';
import { createActivity, createGroupedActivity } from 'types/Activity';
import { createActivityReaction } from 'types/ActivityReaction';

import { createActivityInterfaces } from 'interfaces/Activity';

import { getFeed, followFeed, unfollowFeed } from 'types/Feed/resolvers';
import { getActivities, addActivity, addActivities, removeActivity } from 'types/Activity/resolvers';
import { addReaction, getReactions, updateReaction, removeReaction } from 'types/ActivityReaction/resolvers';

import { ensureScalars } from './ensureScalars';

const createFeedTypes = opts => {
    const feeds = {};

    for (let i = 0; i < opts.feed.length; i++) {
        const feed = opts.feed[i];

        if (!feed.feedGroup) {
            throw new Error('Please provide the name of your feed group to opts.feedGroup.');
        }

        const options = {
            ...opts,
            feed,
        };

        // Create TypeComposers
        const FeedTC = createFeed(options);
        const ActivityTC = createActivity(options); // ActivityTC is created regardless of type, as grouped activities use this type for their activities field.
        const GroupedActivityTC = createGroupedActivity(ActivityTC, options);
        const ActivityReactionTC = createActivityReaction(ActivityTC, options);

        const name = camelCase(`${feed.feedGroupName}Feed`);

        // TODO: Collection resolvers
        // TODO: User Resolvers
        // TODO: Subscription resolvers
        const data = {
            FeedTC,
            ActivityTC,
            ActivityReactionTC,
            GroupedActivityTC,
            query: {
                getFeed: () => getFeed(FeedTC, options),
                getActivities: () => getActivities(GroupedActivityTC ?? ActivityTC, options),
                getReactions: () => getReactions(ActivityReactionTC, options),
            },
            mutation: {
                followFeed: () => followFeed(FeedTC, options),
                unfollowFeed: () => unfollowFeed(FeedTC, options),
                addActivity: () => addActivity(ActivityTC, options),
                addActivities: () => addActivities(ActivityTC, options),
                // TODO: Implement the set/unset update behavior in GQL
                // updateActivity: () => 'Stream',
                removeActivity: () => removeActivity(ActivityTC, options),
                addReaction: () => addReaction(ActivityReactionTC, options),
                updateReaction: () => updateReaction(ActivityReactionTC, options),
                removeReaction: () => removeReaction(ActivityReactionTC, options),
            },
            subscription: {},
        };

        // Relate types together where applicable
        FeedTC.addRelation('activities', {
            prepareArgs: {
                feed: source => source.id,
            },
            projection: { id: true },
            resolver: () => feeds[name].query.getActivities(),
            description: 'Get the list of activities for this feed',
        });

        ActivityTC.addRelation('reactions', {
            prepareArgs: {
                activity: source => source.id,
            },
            projection: { id: true },
            resolver: () => data.query.getReactions(),
            description: 'Get the list of reactions for this activity',
        });

        ActivityReactionTC.addRelation('childReactions', {
            prepareArgs: {
                parent: source => source.id,
            },
            projection: { id: true },
            resolver: () => data.query.getReactions().makeArgNullable('activity'),
            description: 'Get the list of child reactions for this reaction',
        });

        feeds[name] = data;
    }

    return feeds;
};

export const composeActivityFeed = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;
    const { feed } = opts;

    ensureScalars(schemaComposer);

    // Create interface types
    createActivityInterfaces(schemaComposer);

    // Cast feed property to an array if it's not already an array and add the feedGroupName to each
    const options = {
        ...opts,
        feed: castArray(feed).map(feedConfig => ({
            ...feedConfig,
            feedGroupName: capitalize(feedConfig.feedGroup),
        })),
        schemaComposer,
    };

    // Create the various feed & activity types for each feedConfig object.
    const feeds = createFeedTypes(options);

    return {
        interfaces: {
            StreamActivityInterface: schemaComposer.getIFTC('StreamActivityInterface'),
            StreamGroupedActivityInterface: schemaComposer.getIFTC('StreamGroupedActivityInterface'),
        },
        feeds,
        users: {},
        collections: {},
    };
};
