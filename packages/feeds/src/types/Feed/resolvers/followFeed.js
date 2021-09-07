
import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const followFeed = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'follow',
        kind: 'mutation',
        type: tc.schemaComposer.createObjectTC({
			name: 'StreamFollowFeedPayload',
			fields: {
				duration: 'String!',
				followed: 'StreamID!'
			}
		}),
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed that should perform the follow operation',
            },
            target: {
                type: 'StreamID!',
                description: 'The target feed that should be followed.',
            },
            activityCopyLimit: {
                type: 'Int',
                description: 'How many activities should be copied from the target feed, max 1000',
                defaultValue: 100,
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `feed/${args.feed.uri}/follows`,
				method: 'POST',
				data: {
					target: args.target.toString(),
				},
				params: args.activityCopyLimit !== undefined ? {
					activity_copy_limit: args.activityCopyLimit,
				} : undefined,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return {
				...body,
				followed: args.target,
			};
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'follow' });
