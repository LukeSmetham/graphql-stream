import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getFollowing = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getFollowing',
        type: tc.schemaComposer.getOrCreateOTC('StreamFeedFollowPayload', tc => {
			tc.addFields({
				feed_id: 'StreamID!',
				target_id: 'StreamID!',
				created_at: 'DateTime!',
				updated_at: 'DateTime!',
			})
		}).getTypePlural(),
        kind: 'query',
        args: {
			feed: {
				type: 'StreamID!',
				description: 'The feed to fetch the followers for.'
			},
            limit: {
                type: 'Int',
                description: 'The amount of followed feeds requested from the API.',
            },
            offset: {
                type: 'Int',
                description: 'The offset, max 400',
            },
            filter: {
                type: '[StreamID]',
                description:
                    'List of comma separated feed ids to filter on. IE user:1,user:2. Allows you to check if a certain feed is followed.',
            },
        },
        resolve: async ({ args: { feed, ...params } }) => {
            const { body } = await request({
				url: `feed/${feed.uri}/following`,
				credentials: options.credentials,
				params,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.results;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getFollowing' });