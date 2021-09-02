import { pluralize } from 'graphql-compose';
import request from 'utils/request';

export const getEntity = (tc, { credentials, collection } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'getEntity',
        type: tc,
        kind: 'query',
        args: {
            id: 'ID!',
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    url: `collections/${pluralize(collection.name)}/${args.id}`,
                    credentials,
                });

                return body;
            } catch (error) {
                console.error(error);
            }

            return undefined;
        },
    });
