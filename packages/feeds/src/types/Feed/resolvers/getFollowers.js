import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getFollowers = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getFollowers',
        type: '[StreamID!]',
        kind: 'query',
        args: {
			feed: {
				type: 'StreamID!',
				description: 'The feed to fetch the followers for.'
			},
            limit: {
                type: 'Int',
                description: 'The amount of feeds following this feed requested from the API.',
            },
            offset: {
                type: 'Int',
                description: 'The offset, max 400',
            },
        },
        resolve: async ({ args: { feed, ...params } }) => {
            const { body } = await request({
				url: `feed/${feed.uri}/followers`,
				credentials: options.credentials,
				params,
			});

			return body.results.map(({ feed_id }) => feed_id);
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getFollowers' });