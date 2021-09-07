import { pluralize } from 'graphql-compose';
import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getEntity = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getEntity',
        type: tc,
        kind: 'query',
        args: {
            id: 'ID!',
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				url: `collections/${pluralize(options.collection.name)}/${args.id}`,
				credentials: options.credentials,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'getEntity' });
