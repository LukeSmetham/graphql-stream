import request from 'utils/request';

export const getUser = (tc, { credentials } = {}) =>
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
			if (!credentials) {
				throw new Error('Missing Stream Credentials')
			}

            const { body } = await request({
				credentials,
				url: `user/${args.id}`,
				method: 'GET',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    });
