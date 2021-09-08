import phin from 'phin';
import { Resolver, deepmerge, schemaComposer } from 'graphql-compose';

import { StreamID } from 'scalars/StreamID';
import { createActivityInterfaces } from 'interfaces/Activity';
import { ensureScalars } from 'utils/ensureScalars';

import { createActivityTC } from '../Activity';
import { addActivity } from './addActivity';

const credentials = {
	api_key: 'STREAM_API_KEY',
	api_secret: 'STREAM_API_SECRET',
	app_id: 'STREAM_APP_ID',
};

const resolveParams = {
	source: {}, 
	args: {
		feed: new StreamID('user:1'),
		activity: {
			actor: '1',
			object: '2',
			verb: 'post',
		}
	},
	context: {},
	info: {},
};

describe('addActivity Resolver', () => {
	let ActivityTC;
	beforeAll(() => {
		schemaComposer.clear();

		ensureScalars(schemaComposer)
		createActivityInterfaces(schemaComposer);
		
		ActivityTC = createActivityTC({
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
			}
		});
	});

	test('returns a graphql-compose resolver instance', () => {
		const resolver = addActivity(ActivityTC, { credentials });

		expect(resolver).toBeInstanceOf(Resolver)
	})
	
	test('makes a POST request to the /feed/:feed/:id endpoint', () => {
		const resolver = addActivity(ActivityTC, { credentials });

		resolver.resolve(resolveParams).then((response) => {
			expect(response.method).toEqual('POST');
			expect(response.url).toEqual(`https://api.stream-io-api.com/api/v1.0/feed/${resolveParams.args.feed.uri}?api_key=${credentials.api_key}`);
			expect(response.data).toEqual(resolveParams.args.activity);
		})
	})
	
	test('Should convert the `to` fields array of StreamID values into colon-separated IDs', () => {
		const resolver = addActivity(ActivityTC, { credentials });

		const resolveParams2 = deepmerge(resolveParams, {
			args: {
				activity: {
					to: [new StreamID('timeline:1')]
				}
			}
		});

		resolver.resolve(resolveParams2).then((response) => {
			expect(response.data.to).toEqual(resolveParams2.args.activity.to.map(id => id.toString()));
		})
	})

	test('throws an error if the body contains a status_code property', () => {
		const resolver = addActivity(ActivityTC, { credentials });

		phin.mockImplementationOnce(() => Promise.resolve({ 
			body: {
				status_code: 500,
				detail: 'Something went wrong.'
			} 
		}));

		expect(() => resolver.resolve(resolveParams)).rejects.toThrow(/Something went wrong./);
	});
});
