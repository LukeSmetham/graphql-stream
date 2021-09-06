import phin from 'phin';
import { Resolver, schemaComposer } from 'graphql-compose';

import { createActivityReactionTC } from '../ActivityReaction';
import { addReaction } from './addReaction';

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

	test('makes a POST request to the /reaction endpoint', () => {
		const resolver = addReaction(ActivityReactionTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction?api_key=${credentials.api_key}`);
			expect(response.data).toEqual({
				activity_id: resolveParams.args.activity,
				kind: resolveParams.args.kind,
				data: resolveParams.args.data,
				user_id: resolveParams.args.user,
				parent: resolveParams.args.parent,
			});
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = addReaction(ActivityReactionTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
