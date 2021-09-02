import { composer } from 'schema';
import capitalize from 'capitalize';

import { createFeedTC } from 'types/Feed';
import { createActivityTC, createGroupedActivityTC } from 'types/Activity';
import { createActivityReactionTC } from 'types/ActivityReaction';

import * as feedResolvers from 'types/Feed/resolvers';
import * as activityResolvers from 'types/Activity/resolvers';
import * as activityReactionResolvers from 'types/ActivityReaction/resolvers';

export const createActivityFeed = options => {
    const schemaComposer = options.schemaComposer || composer;

    if (!options.feed.feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    // Create TypeComposers
    const FeedTC = createFeedTC(options);
    const ActivityTC = createActivityTC(options); // ActivityTC is created regardless of type, as grouped activities use this type for their activities field.
    const GroupedActivityTC = createGroupedActivityTC(ActivityTC, options);

    Object.keys(feedResolvers).forEach(k => {
        FeedTC.addResolver(feedResolvers[k](FeedTC, options));
    });

    Object.keys(activityResolvers).forEach(k => {
        FeedTC.addResolver(activityResolvers[k](ActivityTC, options));
    });

    // TODO: Subscription resolvers
    const data = {
        [capitalize(`${FeedTC.getTypeName()}TC`, true)]: FeedTC,
        [capitalize(`${ActivityTC.getTypeName()}TC`, true)]: ActivityTC,
    };

    if (GroupedActivityTC) {
        data[capitalize(`${GroupedActivityTC.getTypeName()}TC`, true)] = GroupedActivityTC;
    }

    // Relate types together where applicable
    FeedTC.addRelation('activities', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getActivities'),
        description: 'Get the list of activities for this feed',
    });

    ActivityTC.addRelation('reactions', {
        prepareArgs: {
            activity: source => source.id,
        },
        projection: { id: true },
        resolver: () => schemaComposer.getOTC('StreamActivityReaction').getResolver('getReactions'),
        description: 'Get the list of reactions for this activity',
    });

    return data;
};
