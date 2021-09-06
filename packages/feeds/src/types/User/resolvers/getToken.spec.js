import jwt from 'jsonwebtoken';
import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { getToken } from './getToken';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolverParams = {
	source: {}, 
	args: {
		id: 1,
	},
	context: {},
	info: {},
};

describe('getToken Resolver', () => {
	beforeAll(() => {
		schemaComposer.clear();
	});

	test('returns a token from the resolve method based on the source id', () => {		
		const expectedToken = jwt.sign({
			user_id: resolverParams.args.id
		}, credentials.api_secret);

		const UserTC = createUserTC(schemaComposer);

		const resolver = getToken(UserTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver);
		expect(resolver.resolve(resolverParams)).toEqual(expectedToken);
	});

	test('should throw an error if no credentials are provided.', () => {	
		const UserTC = createUserTC(schemaComposer);

		const resolver = getToken(UserTC, {});

		expect(() => {
			resolver.resolve(resolverParams)
		}).toThrow('secretOrPrivateKey must have a value');
	});
});
