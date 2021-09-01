import { createFeed } from 'types/Feed';
import { createActivity, createGroupedActivity } from 'types/Activity';
import { createActivityReaction } from 'types/ActivityReaction';

import { getFeed, followFeed, unfollowFeed } from 'types/Feed/resolvers';
import { getActivities, addActivity, addActivities, removeActivity } from 'types/Activity/resolvers';
import { addReaction, getReactions, updateReaction, removeReaction } from 'types/ActivityReaction/resolvers';

export const createActivityFeed = options => {
    if (!options.feed.feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    // Create TypeComposers
    const FeedTC = createFeed(options);
    const ActivityTC = createActivity(options); // ActivityTC is created regardless of type, as grouped activities use this type for their activities field.
    const GroupedActivityTC = createGroupedActivity(ActivityTC, options);
    const ActivityReactionTC = createActivityReaction(ActivityTC, options);

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
        resolver: () => data.query.getActivities(),
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

    return data;
};
