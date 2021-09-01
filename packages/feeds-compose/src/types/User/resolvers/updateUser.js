import request from 'utils/request';

export const updateUser = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'updateUser',
        kind: 'mutation',
        type: tc,
        args: {
            id: {
                type: 'ID!',
                description: 'The ID for the user you want to create.',
            },
            data: {
                type: 'JSON',
                description: 'Any extra data to be attached to the new User.',
            },
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    credentials,
                    url: `user/${args.id}`,
                    method: 'PUT',
                    data: {
                        data: args.data,
                    },
                });

                return body;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });