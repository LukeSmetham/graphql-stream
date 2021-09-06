import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const updateUser = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'updateUser',
        kind: 'mutation',
        type: tc,
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to create.',
            },
            data: {
                type: 'JSON',
                description: 'Any extra data to be attached to the new User.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `user/${args.id}`,
				method: 'PUT',
				data: {
					data: args.data,
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'updateUser' });
