import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';
import { validateFeedType } from 'utils/validateFeedType';

import { createActivityTC, createGroupedActivityTC } from './activities';
import * as resolvers from './resolvers';
import * as activityResolvers from './activities/resolvers';
import { createFeedSubscription } from './createFeedSubscription';

export const createFeedTC = (options) => {
	if (!options) {
		throw new Error('No options were provided to createFeedTC');
	}

    const schemaComposer = options.schemaComposer || composer;

	const opts = deepmerge(options, {
		feed: {
			feedGroupName: capitalize(options.feed.feedGroup)
		}
	});

    const { feedGroupName, type } = opts.feed;

    // Will throw if the type is invalid
    validateFeedType(type);

    const typeName = `Stream${feedGroupName}Feed`;

    const FeedTC = schemaComposer.createObjectTC({
        name: typeName,
        fields: {
            id: 'StreamID!',
        },
    });

	const ActivityTC = createActivityTC(options); // ActivityTC is created regardless of type, as grouped activities use this type for their activities field.
	const GroupedActivityTC = createGroupedActivityTC(ActivityTC, options);

	// Add resolvers to the FeedTC
    Object.keys(resolvers).forEach(k => {
        FeedTC.addResolver(resolvers[k](FeedTC, options));
    });

    Object.keys(activityResolvers).forEach(k => {
        FeedTC.addResolver(activityResolvers[k](ActivityTC, options));
    });

	// Add Relational Fields
	FeedTC.addRelation('followers', {
        prepareArgs: {
            feed: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getFollowers'),
        description: 'Get the list of followers for this feed',
    });
    
	FeedTC.addRelation('followersCount', {
        prepareArgs: {
            feed: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getFollowersCount'),
        description: 'Get the count of followers for this feed',
    });
    
	FeedTC.addRelation('following', {
        prepareArgs: {
            feed: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getFollowing'),
        description: 'Get the list of feeds that this feed follows',
    });
    
	FeedTC.addRelation('followingCount', {
        prepareArgs: {
            feed: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getFollowingCount'),
        description: 'Get the count of feeds that this feed follows',
    });

    FeedTC.addRelation('activities', {
        prepareArgs: {
            feed: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => FeedTC.getResolver('getActivities').setType(GroupedActivityTC?.getTypePlural() ?? ActivityTC.getTypePlural()),
        description: 'Get the list of activities for this feed',
    });

    ActivityTC.addRelation('reactions', {
        prepareArgs: {
            activity: /* istanbul ignore next */ source => source.id,
        },
        projection: { id: true },
        resolver: () => schemaComposer.getOTC('StreamActivityReaction').getResolver('getReactions'),
        description: 'Get the list of reactions for this activity',
    });

	// Subscription
	// Subscriptions aren't really supported in graphql-compose, because of this the only way to add them is via a plain object resolver rather than via schemaComposer.createResolver.
	// So we return the plain object from the below method and add it to the TC so end-users can manually add to their schema in a similar way to other resolvers.
	FeedTC.subscription = createFeedSubscription(ActivityTC, options);

    return FeedTC;
};
