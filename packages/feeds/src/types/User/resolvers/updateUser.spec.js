import { Resolver, schemaComposer } from 'graphql-compose';

import { createUserTC } from '../User';
import { updateUser } from './updateUser';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

describe('updateUser Resolver', () => {
	let UserTC;
	beforeAll(() => {
		schemaComposer.clear();
		UserTC = createUserTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = updateUser(UserTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
});
