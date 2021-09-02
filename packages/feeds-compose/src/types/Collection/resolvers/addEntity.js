import { pluralize } from 'graphql-compose';
import request from 'utils/request';

export const addEntity = (tc, { credentials, collection } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'addEntity',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'ID',
                description: `The id of the ${collection.name}. Stream will generate one if you leave this arg empty.`,
            },
            data: () => tc.getInputType(),
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    url: `collections/${pluralize(collection.name)}`,
                    credentials,
                    method: 'POST',
                    data: args,
                });

                return body;
            } catch (error) {
                console.error(error);
            }

            return undefined;
        },
    });
