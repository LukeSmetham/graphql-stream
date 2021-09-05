import jwt from 'jsonwebtoken';

export const createTokenField = (schemaComposer, options) =>
    schemaComposer.createResolver({
        name: 'getToken',
        type: 'JWT',
        kind: 'query',
        projection: { id: true },
        resolve: ({ source }) =>
            jwt.sign(
                {
                    user_id: source.id,
                },
                options?.credentials?.api_secret
            ),
    });
