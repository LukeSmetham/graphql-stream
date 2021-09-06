import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { createActivityReactionTC } from '../ActivityReaction';
import { getReactions } from './getReactions';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {},
	args: {
		activity: '1',
		kind: 'like',
		user: 'lukesmetham',
	},
	context: {},
	info: {},
};

describe('getReactions Resolver', () => {
	let ActivityReactionTC;
	beforeAll(() => {
		schemaComposer.clear();
		ActivityReactionTC = createActivityReactionTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getReactions(ActivityReactionTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});

	test('throws an error if the body contains a status_code property', () => {
		const resolver = getReactions(ActivityReactionTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
