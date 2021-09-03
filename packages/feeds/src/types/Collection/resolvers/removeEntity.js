import { pluralize } from 'graphql-compose';
import request from 'utils/request';

export const removeEntity = (tc, { credentials, collection } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'removeEntity',
        type: 'StreamID!',
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: `The id of the ${collection.name} you want to remove.`,
            },
        },
        resolve: async ({ args }) => {
            try {
                await request({
                    url: `collections/${pluralize(collection.name)}/${args.id}`,
                    credentials,
                    method: 'DELETE',
                });

                return `${pluralize(collection.name)}/${args.id}`;
            } catch (error) {
                console.error(error);
            }

            return undefined;
        },
    });
