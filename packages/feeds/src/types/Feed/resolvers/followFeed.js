import request from 'utils/request';

export const followFeed = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'follow',
        kind: 'mutation',
        type: 'StreamID',
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
            await request({
				credentials,
				url: `feed/${args.feed.uri}/follows`,
				method: 'POST',
				data: {
					target: args.target.toString(),
				},
				params: {
					activity_copy_limit: args.activityCopyLimit,
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return args.target;
        },
    });
