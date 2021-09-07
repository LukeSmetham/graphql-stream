import { pluralize } from 'graphql-compose';
import capitalize from 'capitalize';
import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const removeEntity = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'removeEntity',
        type: tc.schemaComposer.createObjectTC({
			name: `StreamRemove${capitalize(options.collection.name)}Payload`,
			fields: {
				duration: 'String!',
				removed: 'ID!'
			}
		}),
        kind: 'mutation',
        args: {
            id: {
                type: 'ID!',
                description: `The id of the ${options.collection.name} you want to remove.`,
            },
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				url: `collections/${pluralize(options.collection.name)}/${args.id}`,
				credentials: options.credentials,
				method: 'DELETE',
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return {
				...body,
				removed: `${pluralize(options.collection.name)}/${args.id}`
			};
        },
    })
	.withMiddleware([checkCredentials(options)])
	.clone({ name: 'removeEntity' });
