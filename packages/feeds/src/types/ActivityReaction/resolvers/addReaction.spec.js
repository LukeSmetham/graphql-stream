import { Resolver, schemaComposer } from 'graphql-compose';

import { createActivityReactionTC } from '../ActivityReaction';
import { addReaction } from './addReaction';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

describe('addReaction Resolver', () => {
	let ActivityReactionTC;
	beforeAll(() => {
		schemaComposer.clear();
		ActivityReactionTC = createActivityReactionTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = addReaction(ActivityReactionTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
});
