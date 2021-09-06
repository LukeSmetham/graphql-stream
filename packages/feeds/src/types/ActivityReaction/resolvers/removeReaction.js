import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const removeReaction = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'removeReaction',
        type: tc.schemaComposer.createObjectTC({
			name: 'StreamRemoveReactionPayload',
			fields: {
				duration: 'String!',
				removed: 'ID!'
			}
		}),
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: 'The reactions to be updated.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `reaction/${args.id}`,
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
	.clone({ name: 'removeReaction' });
