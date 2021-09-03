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
            try {
                await request({
                    credentials,
                    url: `reaction/${args.id}`,
                    method: 'DELETE',
                });

                return args.id;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
