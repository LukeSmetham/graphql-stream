import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { getUser } from './getUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {}, 
	args: {
		id: 1,
	},
	context: {},
	info: {},
};

describe('getUser Resolver', () => {
	let UserTC;
	beforeAll(() => {
		schemaComposer.clear();
		UserTC = createUserTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getUser(UserTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})

	test('makes a GET request to the /users/:id endpoint', () => {
		const resolver = getUser(UserTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/user/${resolveParams.args.id}?api_key=${credentials.api_key}`);
		})
	});
	
	test('throws an error if the body contains a status_code property', () => {
		const resolver = getUser(UserTC, { credentials });

		phin.mockImplementationOnce(options => Promise.resolve({ 
			body: {
				status_code: 404,
				detail: 'User does not exist.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/User does not exist./);
	});
});
