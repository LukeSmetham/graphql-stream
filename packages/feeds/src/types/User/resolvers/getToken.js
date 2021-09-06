import jwt from 'jsonwebtoken';

export const getToken = (tc, options) =>
    tc.schemaComposer.createResolver({
        name: 'getToken',
        type: 'JWT',
        kind: 'query',
        projection: { id: true },
		args: { id: 'ID!' },
        resolve: ({ args }) =>
            jwt.sign(
                {
                    user_id: args.id,
                },
                options?.credentials?.api_secret
            ),
    });
