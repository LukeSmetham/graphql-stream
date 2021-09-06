import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { getOrCreateUser } from './getOrCreateUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolverParams = {
	source: {}, 
	args: {
		id: 1,
		data: {
			name: 'Luke',
			email: 'luke@getstream.io'
		}
	},
	context: {},
	info: {},
};

describe('getOrCreateUser Resolver', () => {
	let UserTC;
	beforeAll(() => {
		schemaComposer.clear();
		UserTC = createUserTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getOrCreateUser(UserTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})

	test('makes a POST request to the /user endpoint with the get_or_create parameter', () => {
		const resolver = getOrCreateUser(UserTC, { credentials });

		resolver.resolve(resolverParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/user?api_key=${credentials.api_key}&get_or_create=true`);
			expect(response.data).toEqual(resolverParams.args);
		})
	})
});
