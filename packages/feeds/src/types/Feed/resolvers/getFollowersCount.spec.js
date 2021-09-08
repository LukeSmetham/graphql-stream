import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

import { createFeedTC } from '../Feed';
import { getFollowersCount } from './getFollowersCount';

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

describe('getFollowersCount Resolver', () => {
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
		const resolver = getFollowersCount(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a GET request to the /stats/follow endpoint with the colon-separated feed id as the `followers` parameter', () => {
		const resolver = getFollowersCount(FeedTC, { credentials });

		phin.mockImplementationOnce((options) => Promise.resolve({ 
			body: {
				results: {
					followers: {
						count: options
					}
				},
			} 
		}));

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/stats/follow?api_key=${credentials.api_key}&followers=${resolveParams.args.feed.toString()}`);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = getFollowersCount(FeedTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
