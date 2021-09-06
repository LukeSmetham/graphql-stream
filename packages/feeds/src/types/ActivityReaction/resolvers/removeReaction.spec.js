import { Resolver, schemaComposer } from 'graphql-compose';

import { createActivityReactionTC } from '../ActivityReaction';
import { removeReaction } from './removeReaction';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

describe('removeReaction Resolver', () => {
	let ActivityReactionTC;
	beforeAll(() => {
		schemaComposer.clear();
		ActivityReactionTC = createActivityReactionTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = removeReaction(ActivityReactionTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
});
