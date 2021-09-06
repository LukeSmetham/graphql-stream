import request from 'utils/request';

import { checkCredentials } from 'middleware/checkCredentials';

export const getOrCreateUser = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getOrCreateUser',
        kind: 'query',
        type: tc,
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to create.',
            },
            data: {
                type: 'JSON',
                description: 'Any extra data to be attached to the new User. Will be ignored if not creating the user.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `user`,
				method: 'POST',
				params: {
					get_or_create: true,
				},
				data: {
					id: args.id,
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
	.clone({ name: 'getOrCreateUser' })
