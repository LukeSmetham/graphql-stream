import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { createGetFeedFollowers, createGetFeedFollowing, createGetFeedFollowersCount, createGetFeedFollowingCount } from './fields';

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

export const createFeedTC = (options = {}) => {
    const schemaComposer = options.schemaComposer || composer;
    const credentials = options.credentials;

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
            followers: createGetFeedFollowers(schemaComposer, credentials),
            following: createGetFeedFollowing(schemaComposer, credentials),
            followerCount: createGetFeedFollowersCount(schemaComposer, credentials),
            followingCount: createGetFeedFollowingCount(schemaComposer, credentials),
        },
    });

    return FeedTC;
};
