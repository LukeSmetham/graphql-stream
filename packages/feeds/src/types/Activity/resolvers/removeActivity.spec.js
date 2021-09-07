import phin from 'phin';
import { Resolver, deepmerge, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'composeActivityFeed/ensureScalars';

import { createActivityTC } from '../Activity';
import { removeActivity } from './removeActivity';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {}, 
	args: {
		feed: new StreamID('user:1'),
		id: '2'
	},
	context: {},
	info: {},
};

describe('removeActivity Resolver', () => {
	let ActivityTC;
	beforeAll(() => {
		schemaComposer.clear();
		ensureScalars(schemaComposer)
		createActivityInterfaces(schemaComposer);
		ActivityTC = createActivityTC({
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
			}
		});
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = removeActivity(ActivityTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a DELETE request to the /feed/:feed/:id/:activity endpoint', () => {
		const resolver = removeActivity(ActivityTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('DELETE');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}/${resolveParams.args.id}?api_key=${credentials.api_key}`);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = removeActivity(ActivityTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
