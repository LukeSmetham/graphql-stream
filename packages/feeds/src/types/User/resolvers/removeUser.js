import request from 'utils/request';

export const removeUser = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'removeUser',
        kind: 'mutation',
        type: 'ID',
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to create.',
            },
        },
        resolve: async ({ args }) => {
            await request({
				credentials,
				url: `user/${args.id}`,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return args.id;
        },
    });
