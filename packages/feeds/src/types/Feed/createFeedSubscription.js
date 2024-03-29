import { composer } from 'schema';
import { FeedSubscription } from 'subscription';

export const createFeedSubscription = (ActivityTC, opts) => {
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
		resolve: /* istanbul ignore next */ data => data,
		subscribe: /* istanbul ignore next */ (_, args) => new FeedSubscription(credentials).asyncIterator(args.id.together)
	};
};
