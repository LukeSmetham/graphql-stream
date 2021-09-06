import request from 'utils/request';

import { checkCredentials } from 'middleware/checkCredentials';

export const updateReaction = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'updateReaction',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: 'The reactions to be updated.',
            },
            data: {
                type: 'JSON',
                description: 'The updated data for the reaction.',
            },
            target_feeds: {
                type: '[StreamID!]',
                description: 'Target feeds for the reaction.',
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				credentials: options.credentials,
				url: `reaction/${args.id}`,
				method: 'PUT',
				data: {
					data: args.data,
					target_feeds: args.target_feeds.map(id => id.toString()),
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'updateReaction' });
