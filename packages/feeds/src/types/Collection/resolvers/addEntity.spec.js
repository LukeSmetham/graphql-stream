import phin from 'phin';
import { Resolver, schemaComposer, pluralize } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { addEntity } from './addEntity';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const options = {
	schemaComposer,
	credentials,
	collection: {
		name: 'post',
		fields: {
			text: 'String!',
		}
	}
};

const resolveParams = {
	source: {}, 
	args: {
		id: 1,
		data: {
			text: 'This is a post!',
		}
	},
	context: {},
	info: {},
};

describe('addEntity Resolver', () => {
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();

		MockTC = getMockTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = addEntity(MockTC, options);

		expect(resolver).toBeInstanceOf(Resolver)
	});
	
	test('makes a POST request to the /collection/:collection endpoint', () => {
		const resolver = addEntity(MockTC, options);

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/collections/${pluralize(options.collection.name)}?api_key=${credentials.api_key}`);
			expect(response.data).toEqual(resolveParams.args);
		})
	});

	test('data argument should be the correct InputType', () => {
		const resolver = addEntity(MockTC, options);
		const inputType = MockTC.getInputType();
	
		expect(resolver.getArgType('data')).toBe(inputType);
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = addEntity(MockTC, options);

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 400,
				detail: 'Collection entry already exists.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Collection entry already exists./);
	});
});
