import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getFollowersCount = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getFollowersCount',
        type: 'Int!',
        kind: 'query',
		args: {
			feed: {
				type: 'StreamID!',
				description: 'The feed to fetch the followers for.'
			},
		},
        resolve: async ({ args }) => {
            const { body } = await request({
				url: `stats/follow`,
				credentials: options.credentials,
				params: {
					followers: args.feed.toString(),
				},
			});

			return body.results.followers.count;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getFollowersCount' });