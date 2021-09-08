import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';
import { validateFeedType } from 'utils/validateFeedType';

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
