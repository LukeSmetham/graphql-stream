import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const removeActivity = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'removeActivity',
        kind: 'mutation',
        type: tc.schemaComposer.createObjectTC({
			name: 'StreamRemoveActivityPayload',
			fields: {
				duration: 'String!',
				removed: 'ID!'
			}
		}),
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
				credentials: options.credentials,
				url: `feed/${args.feed.uri}/${args.id}`,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'removeActivity' });
