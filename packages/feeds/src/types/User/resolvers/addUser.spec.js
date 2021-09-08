import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { addUser } from './addUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
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

describe('addUser Resolver', () => {
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();
		MockTC = getMockTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = addUser(MockTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a POST request to the /user endpoint', () => {
		const resolver = addUser(MockTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/user?api_key=${credentials.api_key}`);
			expect(response.data).toEqual(resolveParams.args);
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = addUser(MockTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 404,
				detail: 'User already exists.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/User already exists./);
	});
});
