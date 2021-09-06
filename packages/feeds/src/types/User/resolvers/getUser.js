import request from 'utils/request';

import { checkCredentials } from 'middleware/checkCredentials';

export const getUser = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getUser',
        kind: 'query',
        type: tc,
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to fetch.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `user/${args.id}`,
				method: 'GET',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getUser' });
