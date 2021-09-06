import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const removeUser = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'removeUser',
        kind: 'mutation',
        type: tc.schemaComposer.createObjectTC({
			name: 'StreamRemoveUserPayload',
			fields: {
				duration: 'String!',
				removed: 'ID!'
			}
		}),
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to create.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `user/${args.id}`,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return {
				...body,
				removed: args.id,
			};
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'removeUser' });
