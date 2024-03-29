import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { removeReaction } from './removeReaction';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {},
	args: {
		id: '1',
	},
	context: {},
	info: {},
};

describe('removeReaction Resolver', () => {
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();
		MockTC = getMockTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = removeReaction(MockTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});

	test('makes a DELETE request to the /reaction endpoint', () => {
		const resolver = removeReaction(MockTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('DELETE');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction/${resolveParams.args.id}?api_key=${credentials.api_key}`);
			expect(response.removed).toEqual(resolveParams.args.id);
		})
	});

	test('throws an error if the body contains a status_code property', () => {
		const resolver = removeReaction(MockTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
