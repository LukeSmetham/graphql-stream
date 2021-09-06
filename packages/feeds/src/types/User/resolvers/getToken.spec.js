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
	let UserTC;
	beforeAll(() => {
		schemaComposer.clear();
		UserTC = createUserTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getToken(UserTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})

	test('returns a token from the resolve method based on the source id', () => {		
		const expectedToken = jwt.sign({
			user_id: resolverParams.args.id
		}, credentials.api_secret);

		const resolver = getToken(UserTC, { credentials });

		expect(resolver.resolve(resolverParams)).toEqual(expectedToken);
	});
});
