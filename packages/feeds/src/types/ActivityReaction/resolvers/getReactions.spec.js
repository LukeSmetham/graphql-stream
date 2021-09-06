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

	test('makes a GET request to the correct endpoint based on the provided args', () => {
		const resolver = getReactions(ActivityReactionTC, { credentials });

		phin.mockImplementation(options => Promise.resolve({
			body: {
				results: options
			}
		}))

		const rp1 = {
			args: {
				user: 1,
				options: {
					id_lte: 1,
				}
			}
		}
		
		resolver.resolve(rp1).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction/user_id/${rp1.args.user}?api_key=${credentials.api_key}&id_lte=1`);
		})
		
		const rp2 = {
			args: {
				activity: 1,
				options: {
					limit: 2,
					id_lt: 1,
				}
			}
		}
		
		resolver.resolve(rp2).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction/activity_id/${rp2.args.activity}?api_key=${credentials.api_key}&limit=2&id_lt=1`);
		})
		
		const rp3 = {
			args: {
				parent: 1,
				options: {
					id_gt: 1,
				}
			}
		}
		
		resolver.resolve(rp3).then((response) => {
			expect(response.method).toEqual('GET');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/reaction/reaction_id/${rp3.args.parent}?api_key=${credentials.api_key}&id_gt=1`);
		})
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
