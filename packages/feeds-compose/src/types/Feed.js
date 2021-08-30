import { composer } from 'schema';
import capitalize from 'capitalize';
import { JSONResolver, UUIDResolver } from 'graphql-scalars';

import { createActivity } from './Activity';

import { StreamIDResolver } from '../scalars';

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

/**
 * Creates the getActivities resolver, using the given activity type composer.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetActivities = tc =>
    tc.schemaComposer.createResolver({
        name: 'getActivities',
        type: [tc],
        kind: 'query',
        resolve: () => [
            {
                actor: 0,
                verb: 'post',
                object: 'video',
                src: 'https://video.com',
            },
        ],
    });

export const createActivityFeed = (opts = {}) => {
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
        fields: {
            activities: createGetActivities(activityTC),
            id: 'StreamID!',
            followers: '[StreamID!]',
            following: '[StreamID!]',
            followerCount: 'Int!',
            followingCount: 'Int!',
        },
    });

    return feedTC;
};
