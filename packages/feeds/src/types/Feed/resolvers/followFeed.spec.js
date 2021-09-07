import { Resolver, schemaComposer } from 'graphql-compose';

import { createFeedTC } from '../Feed';
import { followFeed } from './followFeed';

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

describe('followFeed resolver', () => {
	let FeedTC;
	beforeAll(() => {
		schemaComposer.clear();
		FeedTC = createFeedTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = followFeed(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});
});
