import request from 'utils/request';

export const removeActivity = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'removeActivity',
        kind: 'mutation',
        type: 'String!',
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed to remove the activity from.',
            },
            id: {
                type: 'ID!',
                description: 'The id or foreign_id of the activity to delete.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials,
				url: `feed/${args.feed.uri}/${args.id}`,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.removed;
        },
    });
