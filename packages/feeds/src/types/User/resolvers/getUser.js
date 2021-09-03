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
            try {
                const { body } = await request({
                    credentials,
                    url: `user/${args.id}`,
                    method: 'GET',
                });

                return body;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
