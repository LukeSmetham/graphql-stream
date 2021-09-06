import request from 'utils/request';

export const getOrCreateUser = (tc, { credentials } = {}) =>
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
				credentials,
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
    });
