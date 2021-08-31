import request from 'utils/request';

export const updateReaction = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'updateReaction',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'UUID!',
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
            try {
                const { body } = await request({
                    credentials,
                    url: `reaction/${args.id}`,
                    method: 'PUT',
                    data: {
                        data: args.data,
                        target_feeds: args.target_feeds,
                    },
                });

                return body;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
