import { ApolloError } from 'apollo-server';
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
            const { body } = await request({
				url: `collections/${pluralize(collection.name)}/${args.id}`,
				credentials,
			});

			if (body.status_code !== undefined) {
				throw new ApolloError(body.detail);
			}

			return body;
        },
    });
