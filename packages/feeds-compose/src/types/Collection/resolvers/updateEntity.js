import { pluralize } from 'graphql-compose';
import request from 'utils/request';

export const updateEntity = (tc, { credentials, collection } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'updateEntity',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: `The id of the ${collection.name} you want to update.`,
            },
            data: () => tc.getInputType(),
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    url: `collections/${pluralize(collection.name)}/${args.id}`,
                    credentials,
                    method: 'PUT',
                    data: {
                        data: args.data,
                    },
                });

                return body;
            } catch (error) {
                console.error(error);
            }

            return undefined;
        },
    });
