import { composer } from 'schema';
import capitalize from 'capitalize';

import { createFeedTC } from 'types/Feed';
import { createActivityTC, createGroupedActivityTC } from 'types/Activity';

import * as feedResolvers from 'types/Feed/resolvers';
import * as activityResolvers from 'types/Activity/resolvers';

import { createFeedSubscription } from 'types/Feed/createFeedSubscription';

export const createActivityFeed = options => {
    const schemaComposer = options.schemaComposer || composer;

    if (!options.feed.feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    // Create TypeComposers
    const FeedTC = createFeedTC(options);
    const ActivityTC = createActivityTC(options); // ActivityTC is created regardless of type, as grouped activities use this type for their activities field.
	const GroupedActivityTC = createGroupedActivityTC(ActivityTC, options);
    
	// Subscription
	// Subscriptions aren't really support in graphql-compose, because of this the only way to add them is via a plain object resolver rather than via schemaComposer.createResolver.
	// So we return the plain object from the below method and add it to the TC so end-users can manually add to their schema in a similar way to other resolvers.
	FeedTC.subscription = createFeedSubscription(options, ActivityTC);

    Object.keys(feedResolvers).forEach(k => {
        FeedTC.addResolver(feedResolvers[k](FeedTC, options));
    });

    Object.keys(activityResolvers).forEach(k => {
        FeedTC.addResolver(activityResolvers[k](ActivityTC, options));
    });

    // Relate types together where applicable
    FeedTC.addRelation('activities', {
        prepareArgs: {
            feed: source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getActivities').setType(GroupedActivityTC?.getTypePlural() ?? ActivityTC.getTypePlural()),
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

    const tcs = {
        [capitalize(`${FeedTC.getTypeName()}TC`, true)]: FeedTC,
        [capitalize(`${ActivityTC.getTypeName()}TC`, true)]: ActivityTC,
    };

    if (GroupedActivityTC) {
        tcs[capitalize(`${GroupedActivityTC.getTypeName()}TC`, true)] = GroupedActivityTC;
    }

    return tcs;
};
