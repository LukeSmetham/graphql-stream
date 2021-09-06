import request from 'utils/request';

export const unfollowFeed = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'unfollow',
        kind: 'mutation',
        type: 'StreamID',
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
				credentials,
				url: `feed/${args.feed.uri}/following/${args.target.toString()}`,
				method: 'DELETE',
				params: {
					keep_history: args.keepHistory,
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return args.target;
        },
    });
