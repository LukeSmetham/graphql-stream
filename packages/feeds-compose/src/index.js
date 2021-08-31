import { SchemaComposer } from 'graphql-compose';
import { createActivityFeed } from 'types';

export const createActivityFeedsSchema = (composer, opts) => {
    const schemaComposer = composer || new SchemaComposer();

    const Feed = createActivityFeed({
        ...opts,
        schemaComposer,
    });

    schemaComposer.Query.addFields({
        feed: Feed.activityFeedResolvers.getFeed(),
    });

    schemaComposer.Mutation.addFields({
        addActivities: Feed.activityFeedResolvers.addActivities(),
        addActivity: Feed.activityFeedResolvers.addActivity(),
        followFeed: Feed.activityFeedResolvers.followFeed(),
        removeActivity: Feed.activityFeedResolvers.removeActivity(),
        unfollowFeed: Feed.activityFeedResolvers.unfollowFeed(),
    });

    const schema = schemaComposer.buildSchema();

    return schema;
};

export * from './types';
