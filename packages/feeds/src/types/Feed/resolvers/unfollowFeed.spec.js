import phin from 'phin';
import { Resolver, deepmerge, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

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

const resolveParams = {
	source: {},
	args: {
		feed: new StreamID('timeline:1'),
		target: new StreamID('user:1')
	},
	context: {},
	info: {},
}

describe('unfollowFeed resolver', () => {
	let FeedTC;
	beforeAll(() => {
		schemaComposer.clear();
		
		ensureScalars(schemaComposer);
		createActivityInterfaces(schemaComposer);
		
		FeedTC = createFeedTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = unfollowFeed(FeedTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});

	test('makes a DELETE request to the /feed/:feed/:id/following/target:feed endpoint', () => {
		const resolver = unfollowFeed(FeedTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('DELETE');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}/following/${resolveParams.args.target.toString()}?api_key=${credentials.api_key}`);
		})
	})
	
	test('appends keep_history parameter to the URL if the keepHistory arg is present', () => {
		const resolver = unfollowFeed(FeedTC, { credentials });

		const resolveParams2 = deepmerge(resolveParams, {
			args: {
				keepHistory: false
			}
		});

		resolver.resolve(resolveParams2).then((response) => {
			expect(response.method).toEqual('DELETE');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams2.args.feed.uri}/following/${resolveParams2.args.target.toString()}?api_key=${credentials.api_key}&keep_history=false`);
		})
	});

	test('throws an error if the body contains a status_code property', () => {
		const resolver = unfollowFeed(FeedTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 404,
				detail: 'Feed does not exist.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Feed does not exist./);
	});
});
