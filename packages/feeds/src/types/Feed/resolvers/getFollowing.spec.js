import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

import { createFeedTC } from '../Feed';
import { getFollowing } from './getFollowing';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {}, 
	args: {
		feed: new StreamID('user:1'),
	},
	context: {},
	info: {},
};

describe('getFollowing Resolver', () => {
	let FeedTC;
	beforeAll(() => {
		schemaComposer.clear();
		
		ensureScalars(schemaComposer)
		createActivityInterfaces(schemaComposer);

		FeedTC = createFeedTC({
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
			}
		});
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getFollowing(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a GET request to the /feed/:feed/:id/following endpoint', () => {
		const resolver = getFollowing(FeedTC, { credentials });

		phin.mockImplementationOnce((options) => Promise.resolve({ 
			body: {
				results: options,
			} 
		}));

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}/following?api_key=${credentials.api_key}`);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = getFollowing(FeedTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});