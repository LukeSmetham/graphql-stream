import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { StreamID } from 'scalars/StreamID';

import { getActivities } from './getActivities';

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

describe('getActivities Resolver', () => {
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();
		
		MockTC = getMockTC(schemaComposer)
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getActivities(MockTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a GET request to the /feed/:feed/:id endpoint', () => {
		const resolver = getActivities(MockTC, { credentials });

		phin.mockImplementationOnce((options) => Promise.resolve({ 
			body: {
				results: options
			} 
		}));

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}?api_key=${credentials.api_key}`);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = getActivities(MockTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
