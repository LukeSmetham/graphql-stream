import request from 'utils/request';

export const getReactions = (tc, { credentials } = {}) =>
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
            options: tc.schemaComposer.createInputTC({
                name: 'StreamActivityReactionOptions',
                fields: {
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
                },
            }),
        },
        resolve: async ({ args }) => {
            try {
                const lookupType = (args.user && 'user_id') || (args.activity && 'activity_id') || (args.parent && 'reaction_id');
                const value = args.user || args.activity || args.parent;

                const { body } = await request({
                    url: `reaction/${lookupType}/${value}${args.kind ? `/${args.kind}` : ''}`,
                    params: args.options,
                    credentials,
                });

                console.log(body);

                return body.results;
            } catch (error) {
                console.error(error);
            }

            return [];
        },
    });
