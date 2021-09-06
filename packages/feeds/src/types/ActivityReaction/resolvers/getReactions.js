import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getReactions = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getReactions',
        type: [tc],
        kind: 'query',
        args: {
            activity: {
                type: 'UUID!',
                description: 'The activity to get reactions for.',
            },
            kind: {
                type: 'String',
                description: 'If provided, the query will only retrieve reactions of a certain kind (e.g. "like")',
            },
            user: {
                type: 'String',
                description: 'Retrieve reactions by user ID.',
            },
            parent: {
                type: 'UUID',
                description: 'Retrieve child reactions by the parent reaction ID.',
            },
            options: tc.schemaComposer.getOrCreateITC('StreamActivityReactionOptions', tc => {
                tc.addFields({
                    id_gte: {
                        type: 'String',
                        description: 'Retrieve reactions created after the on with ID equal to the parameter (inclusive)',
                    },
                    id_gt: {
                        type: 'String',
                        description: 'Retrieve reactions created after the one with ID equal to the parameter.',
                    },
                    id_lte: {
                        type: 'String',
                        description: 'Retrieve reactions created before the one with ID equal to the parameter (inclusive)',
                    },
                    id_lt: {
                        type: 'String',
                        description: 'Retrieve reactions before the one with ID equal to the parameter',
                    },
                    limit: {
                        type: 'Int',
                        description: 'The number of reactions to retrieve (default: 10)',
                    },
                });
            }),
        },
        resolve: async ({ args }) => {
            const lookupType = (args.user && 'user_id') || (args.activity && 'activity_id') || (args.parent && 'reaction_id');
			const value = args.user || args.activity || args.parent;

			const { body } = await request({
				url: `reaction/${lookupType}/${value}${args.kind ? `/${args.kind}` : ''}`,
				params: args.options,
				credentials: options.credentials,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.results;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getReactions' });
