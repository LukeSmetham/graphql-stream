import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { getUser } from './getUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
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
});
