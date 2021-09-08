import { Resolver, schemaComposer } from 'graphql-compose';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

import { createFeedTC } from '../Feed';
import { getFeed } from './getFeed';

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

const resolveParams = {
	source: {},
	args: {
		id: 'user:1'
	},
	context: {},
	info: {},
}

describe('getFeed resolver', () => {
	let FeedTC;
	beforeAll(() => {
		schemaComposer.clear();
		
		ensureScalars(schemaComposer);
		createActivityInterfaces(schemaComposer);

		FeedTC = createFeedTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getFeed(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});
	
	test('returns an object with an `id` property equivalent to `args.id`', () => {
		const resolver = getFeed(FeedTC, { credentials });

		expect(resolver.resolve(resolveParams).id).toBe(resolveParams.args.id)
	});
});
