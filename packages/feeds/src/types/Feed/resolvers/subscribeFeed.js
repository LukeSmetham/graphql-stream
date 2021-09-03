import { FeedSubscription } from 'subscription';

export const subscribeFeed = (tc, credentials) =>
    tc.schemaComposer.createResolver({
        name: 'subscribeFeed',
        type: tc,
        kind: 'subscription',
        args: { id: 'StreamID!' },
        subscribe: (_, args) => {
			console.log('running')
			return new FeedSubscription(credentials).asyncIterator(args.id)
		},
    });
