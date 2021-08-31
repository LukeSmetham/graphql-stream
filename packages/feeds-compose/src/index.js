import { SchemaComposer } from 'graphql-compose';
import { createActivityFeed } from 'types';

export const createActivityFeedsSchema = (composer, opts) => {
    const schemaComposer = composer || new SchemaComposer();

    const { FeedTC } = createActivityFeed({
        ...opts,
        schemaComposer,
    });

    schemaComposer.Query.addFields({
        feed: FeedTC.activityFeedResolvers.getFeed(),
    });

    schemaComposer.Mutation.addFields({
        addActivities: FeedTC.activityFeedResolvers.addActivities(),
        addActivity: FeedTC.activityFeedResolvers.addActivity(),
        followFeed: FeedTC.activityFeedResolvers.followFeed(),
        removeActivity: FeedTC.activityFeedResolvers.removeActivity(),
        unfollowFeed: FeedTC.activityFeedResolvers.unfollowFeed(),
    });

    const schema = schemaComposer.buildSchema();

    return schema;
};

export * from './types';
