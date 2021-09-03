import { composer } from 'schema';
import { FeedSubscription } from 'subscription';

export const createFeedSubscription = (opts = {}, ActivityTC) => {
    const schemaComposer = opts.schemaComposer || composer;
    const credentials = opts.credentials;

    const { feedGroupName } = opts.feed;

    const typeName = `Stream${feedGroupName}RealtimeFeed`;

    const RealtimeFeedTC = schemaComposer.createObjectTC({
        name: typeName,
        fields: {
            feed: 'StreamID!',
			deleted:  '[ID!]',
			deleted_foreign_ids: '[String!]',
			new: [ActivityTC]
        },
    });

    return {
		name: 'subscribeFeed',
		type: RealtimeFeedTC,
		args: { id: 'StreamID!' },
		resolve: data => data,
		subscribe: (_, args) => new FeedSubscription(credentials).asyncIterator(args.id.together)
	};
};
