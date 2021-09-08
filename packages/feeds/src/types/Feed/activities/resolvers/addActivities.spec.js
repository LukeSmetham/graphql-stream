import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { StreamID } from 'scalars/StreamID';

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
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();

		MockTC = getMockTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = addActivities(MockTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a POST request to the /feed/:feed/:id endpoint', () => {
		const resolver = addActivities(MockTC, { credentials });

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
		const resolver = addActivities(MockTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
