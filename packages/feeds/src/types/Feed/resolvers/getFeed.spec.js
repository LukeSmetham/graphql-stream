import { Resolver, schemaComposer } from 'graphql-compose';
import { getMockTC } from '__mocks__/MockTC';

import { getFeed } from './getFeed';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {},
	args: {
		id: 'user:1'
	},
	context: {},
	info: {},
}

describe('getFeed resolver', () => {
	let MockTC;
	beforeAll(() => {
		schemaComposer.clear();

		MockTC = getMockTC(schemaComposer);
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = getFeed(MockTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	});
	
	test('returns an object with an `id` property equivalent to `args.id`', () => {
		const resolver = getFeed(MockTC, { credentials });

		expect(resolver.resolve(resolveParams).id).toBe(resolveParams.args.id)
	});
});
