import { composer } from 'schema';

import { createFeed } from './Feed';
import { createActivity } from './Activity';
import { createGetActivities, createGetFeed } from '../resolvers';

import { followFeed } from './Feed/resolvers';

const createActivityFeed = (opts = {}, credentials) => {
    const schemaComposer = opts.schemaComposer || composer;
    // TODO?: Add Interfaces for feed and activity.

    const FeedTC = createFeed(opts, credentials);
    const ActivityTC = createActivity(opts, credentials);

    FeedTC.activityFeedResolvers = {
        getFeed: () => createGetFeed(FeedTC, credentials),
        getActivities: () => createGetActivities(ActivityTC, credentials),
        followFeed: () => followFeed(schemaComposer, credentials),
        // unfollow: () => 'Stream',
        // addActivity: () => 'Stream',
        // addActivities: () => 'Stream',
        // updateActivity: () => 'Stream',
        // removeActivity: () => 'Stream',
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
    });

    return FeedTC;
};

const composeActivityFeed = (tc, opts, credentials) => {
    const { fieldName = 'feed' } = opts;

    tc.addFields({
        [fieldName]: createActivityFeed(opts, credentials),
    });
};

export { createActivityFeed, composeActivityFeed };
