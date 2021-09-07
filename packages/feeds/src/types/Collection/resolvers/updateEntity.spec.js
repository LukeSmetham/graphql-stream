import phin from 'phin';
import { Resolver, schemaComposer, pluralize } from 'graphql-compose';

import { createCollectionInterfaces } from 'interfaces/Collection';

import { createCollectionTC } from '../Collection';
import { updateEntity } from './updateEntity';

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
			text: 'This is some new post text!',
		}
	},
	context: {},
	info: {},
};

describe('updateEntity Resolver', () => {
	let CollectionTC;
	beforeAll(() => {
		schemaComposer.clear();
		createCollectionInterfaces(schemaComposer);
		CollectionTC = createCollectionTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = updateEntity(CollectionTC, options);

		expect(resolver).toBeInstanceOf(Resolver)
	});
	
	test('makes a PUT request to the /collection/:collection/:id endpoint', () => {
		const resolver = updateEntity(CollectionTC, options);

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('PUT');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/collections/${pluralize(options.collection.name)}/${resolveParams.args.id}?api_key=${credentials.api_key}`);
		})
	});

	test('data argument should be the correct InputType', () => {
		const resolver = updateEntity(CollectionTC, options);
		const inputType = CollectionTC.getInputType();
	
		expect(resolver.getArgType('data')).toBe(inputType);
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = updateEntity(CollectionTC, options);

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 400,
				detail: 'Collection entry already exists.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Collection entry already exists./);
	});
});
