import { Resolver, schemaComposer } from 'graphql-compose';

import { createFeedTC } from '../Feed';
import { unfollowFeed } from './unfollowFeed';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const options = {
	schemaComposer,
	feed: {
		feedGroup: 'user',
		type: 'flat',
	}
};

describe('unfollowFeed resolver', () => {
	let FeedTC;
	beforeAll(() => {
		schemaComposer.clear();
		FeedTC = createFeedTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = unfollowFeed(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});
});
