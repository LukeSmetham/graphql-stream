import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

import { createActivityTC } from '../Activity';
import { addActivities } from './addActivities';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {}, 
	args: {
		feed: new StreamID('user:1'),
		activities: [{
			actor: '1',
			object: '2',
			verb: 'post',
			to: [new StreamID('timeline:1')]
		}, {
			actor: '1',
			object: '2',
			verb: 'post'
		}]
	},
	context: {},
	info: {},
};

describe('addActivities Resolver', () => {
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
		const resolver = addActivities(ActivityTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a POST request to the /feed/:feed/:id endpoint', () => {
		const resolver = addActivities(ActivityTC, { credentials });

		phin.mockImplementationOnce((options) => Promise.resolve({ 
			body: {
				activities: options,
			} 
		}));

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}?api_key=${credentials.api_key}`);
			expect(response.data.activities).toEqual(resolveParams.args.activities);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = addActivities(ActivityTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
