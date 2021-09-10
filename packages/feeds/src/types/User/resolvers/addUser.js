import request from 'utils/request';

import { checkCredentials } from 'middleware/checkCredentials';

export const addUser = (tc, options) =>
    tc.schemaComposer
        .createResolver({
            name: 'addUser',
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
                const { body } = await request({
                    credentials: options.credentials,
                    url: `user`,
                    method: 'POST',
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
        })
        .withMiddlewares([checkCredentials(options)])
        .clone({ name: 'addUser' });
