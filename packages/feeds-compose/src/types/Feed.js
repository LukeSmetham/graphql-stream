import { composer } from 'schema';
import capitalize from 'capitalize';
import { JSONResolver, UUIDResolver } from 'graphql-scalars';

import { createActivity } from './Activity';
import { StreamIDResolver } from '../scalars';
import {
    createGetActivities,
    createGetFeed,
    createGetFeedFollowers,
    createGetFeedFollowing,
    createGetFeedFollowersCount,
    createGetFeedFollowingCount,
} from '../resolvers';

/**
 * Checks the provided feed type is valid, can be either flat, aggregated or notification
 * @param {String} type
 * @returns the name of the feed type
 */
const validateFeedType = type => {
    if (type !== 'flat' && type !== 'aggregated' && type !== 'notification') {
        throw new Error('Unrecognized Feed Type • Choose either `flat` `aggregated` or `notification`');
    }

    return type;
};

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

export const createActivityFeed = (opts = {}, credentials) => {
    const schemaComposer = opts.schemaComposer || composer;

    ensureScalars(schemaComposer);

    const { feedGroup, type = 'flat' } = opts;

    if (!feedGroup) {
        throw new Error('Please provide the name of your feed group to opts.feedGroup.');
    }

    const activityTC = createActivity(opts);

    const feedGroupName = capitalize(feedGroup);
    const feedType = capitalize(validateFeedType(type));

    const feedTC = schemaComposer.createObjectTC({
        name: `Stream${feedGroupName}${feedType}Feed`,
        interfaces: [],
        fields: {
            activities: createGetActivities(activityTC, credentials),
            id: 'StreamID!',
            followers: createGetFeedFollowers(schemaComposer, credentials),
            following: createGetFeedFollowing(schemaComposer, credentials),
            followerCount: createGetFeedFollowersCount(schemaComposer, credentials),
            followingCount: createGetFeedFollowingCount(schemaComposer, credentials),
        },
    });

    return createGetFeed(feedTC, credentials);
};
