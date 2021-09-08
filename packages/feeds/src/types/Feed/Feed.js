import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

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

    return FeedTC;
};
