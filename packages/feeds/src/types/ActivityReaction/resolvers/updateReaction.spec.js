import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { createActivityReactionTC } from '../ActivityReaction';
import { updateReaction } from './updateReaction';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {},
	args: {
		data: {
			kind: 'like'
		},
		target_feeds: ['user:1', 'timeline: 1']
	},
	context: {},
	info: {},
}

describe('updateReaction Resolver', () => {
	let ActivityReactionTC;
	beforeAll(() => {
		schemaComposer.clear();
		ActivityReactionTC = createActivityReactionTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = updateReaction(ActivityReactionTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});

	test('makes a PUT request to the /reaction/:id endpoint', () => {
		const resolver = updateReaction(ActivityReactionTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('PUT');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction/${resolveParams.args.id}?api_key=${credentials.api_key}`);
			expect(response.data).toEqual(resolveParams.args);
		})
	});

	test('throws an error if the body contains a status_code property', () => {
		const resolver = updateReaction(ActivityReactionTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
