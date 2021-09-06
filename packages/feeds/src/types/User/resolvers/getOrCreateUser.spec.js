import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { getOrCreateUser } from './getOrCreateUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
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
});
