import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getFollowingCount = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getFollowingCount',
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
					following: args.feed.toString(),
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.results.following.count;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getFollowingCount' });