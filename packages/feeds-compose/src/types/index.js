import { createFeed } from './Feed';
import { createActivity } from './Activity';
import { createGetActivities, createGetFeed } from '../resolvers';

const createActivityFeed = (opts = {}, credentials) => {
    // TODO?: Add Interfaces for feed and activity.

    const FeedTC = createFeed(opts, credentials);
    const ActivityTC = createActivity(opts, credentials);

    FeedTC.activityFeedResolvers = {
        getFeed: () => createGetFeed(FeedTC, credentials),
        getActivities: () => createGetActivities(ActivityTC, credentials),
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
