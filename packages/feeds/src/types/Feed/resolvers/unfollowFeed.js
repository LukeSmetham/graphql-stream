import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const unfollowFeed = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'unfollow',
        kind: 'mutation',
        type: tc.schemaComposer.createObjectTC({
			name: 'StreamUnfollowFeedPayload',
			fields: {
				duration: 'String!',
				unfollowed: 'StreamID!'
			}
		}),
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed that should perform the unfollow operation',
            },
            target: {
                type: 'StreamID!',
                description: 'The target feed that should be unfollowed.',
            },
            keepHistory: {
                type: 'Boolean',
                description: 'hen provided the activities from target feed will not be kept in the feed',
                defaultValue: false,
            },
        },
        resolve: async ({ args }) => {
            await request({
				credentials: options.credentials,
				url: `feed/${args.feed.uri}/following/${args.target.toString()}`,
				method: 'DELETE',
				params: args.keepHistory !== undefined ? {
					keep_history: args.keepHistory,
				} : null,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return {
				...body,
				unfollowed: args.target
			};
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'unfollow' });
