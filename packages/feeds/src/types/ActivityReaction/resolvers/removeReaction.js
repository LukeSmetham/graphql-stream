import request from 'utils/request';

export const removeReaction = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'removeReaction',
        type: 'UUID!',
        kind: 'mutation',
        args: {
            id: {
                type: 'UUID!',
                description: 'The reactions to be updated.',
            },
        },
        resolve: async ({ args }) => {
            await request({
				credentials,
				url: `reaction/${args.id}`,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return args.id;
        },
    });
