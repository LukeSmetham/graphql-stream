import jwt from 'jsonwebtoken';
import { schemaComposer } from 	'graphql-compose';

import { createTokenField } from './createTokenField';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolverParams = {
	source: {
		id: 1,
	}, 
	args: {},
	context: {},
	info: {},
};

describe('createTokenField', () => {
	beforeAll(() => {
		schemaComposer.clear();
	});

	test('returns a token from the resolve method based on the source id', () => {		
		const expectedToken = jwt.sign({
			user_id: resolverParams.source.id
		}, credentials.api_secret);

		const resolver = createTokenField(schemaComposer, { credentials });

		expect(resolver.resolve(resolverParams)).toEqual(expectedToken);
	});
	
	test('should throw an error if no schemaComposer is provided.', () => {		
		expect(() => {
			createTokenField();
		}).toThrow(/Cannot read property 'createResolver'/);
	});

	test('should throw an error if no credentials are provided.', () => {		
		const resolver = createTokenField(schemaComposer, {});

		expect(() => {
			resolver.resolve(resolverParams)
		}).toThrow('secretOrPrivateKey must have a value');
	});
});
