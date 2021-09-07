import phin from 'phin';
import { deepmerge, Resolver, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';

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

const resolveParams = {
	source: {},
	args: {
		feed: new StreamID('timeline:1'),
		target: new StreamID('user:1')
	},
	context: {},
	info: {},
}

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

	test('makes a POST request to the /feed/:feed/:id/follows endpoint', () => {
		const resolver = followFeed(FeedTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}/follows?api_key=${credentials.api_key}`);
		})
	})
	
	test('appends activity_copy_limit parameter to the URL if the activityCopyLimit arg is present', () => {
		const resolver = followFeed(FeedTC, { credentials });

		const resolveParams2 = deepmerge(resolveParams, {
			args: {
				activityCopyLimit: 10
			}
		});

		resolver.resolve(resolveParams2).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams2.args.feed.uri}/follows?api_key=${credentials.api_key}&activity_copy_limit=10`);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = followFeed(FeedTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 404,
				detail: 'Feed does not exist.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Feed does not exist./);
	});
});
