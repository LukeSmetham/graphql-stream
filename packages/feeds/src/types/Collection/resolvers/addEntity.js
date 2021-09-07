import { pluralize } from 'graphql-compose';
import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const addEntity = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'addEntity',
        type: tc,
        kind: 'mutation',
        args: {
            id: {
                type: 'ID',
                description: `The id of the ${options.collection.name}. Stream will generate one if you leave this arg empty.`,
            },
            data: () => tc.getInputType(),
        },
        resolve: async ({ args }) => {
            const { body } = await request({
				url: `collections/${pluralize(options.collection.name)}`,
				credentials: options.credentials,
				method: 'POST',
				data: args,
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'addEntity' });
