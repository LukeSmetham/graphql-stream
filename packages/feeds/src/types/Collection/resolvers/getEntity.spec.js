import phin from 'phin';
import { Resolver, schemaComposer, pluralize } from 'graphql-compose';

import { createCollectionInterfaces } from 'interfaces/Collection';

import { createCollectionTC } from '../Collection';
import { getEntity } from './getEntity';

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
	},
	context: {},
	info: {},
};

describe('getEntity Resolver', () => {
	let CollectionTC;
	beforeAll(() => {
		schemaComposer.clear();
		createCollectionInterfaces(schemaComposer);
		CollectionTC = createCollectionTC(options);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getEntity(CollectionTC, options);

		expect(resolver).toBeInstanceOf(Resolver)
	});
	
	test('makes a GET request to the /collection/:collection/:id endpoint', () => {
		const resolver = getEntity(CollectionTC, options);

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/collections/${pluralize(options.collection.name)}/${resolveParams.args.id}?api_key=${credentials.api_key}`);
		})
	});

	test('throws an error if the body contains a status_code property', () => {
		const resolver = getEntity(CollectionTC, options);

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 400,
				detail: 'Collection entry already exists.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Collection entry already exists./);
	});
});
