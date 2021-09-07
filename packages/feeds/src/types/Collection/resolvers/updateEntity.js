import { pluralize } from 'graphql-compose';
import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const updateEntity = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'updateEntity',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: `The id of the ${options.collection.name} you want to update.`,
            },
            data: () => tc.getInputType(),
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				url: `collections/${pluralize(options.collection.name)}/${args.id}`,
				credentials: options.credentials,
				method: 'PUT',
				data: {
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
	.clone({ name: 'updateEntity' });
