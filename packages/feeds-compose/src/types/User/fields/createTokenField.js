import jwt from 'jsonwebtoken';

export const createTokenField = (schemaComposer, { credentials } = {}) =>
    schemaComposer.createResolver({
        name: 'getToken',
        type: 'String',
        kind: 'query',
        projection: { id: true },
        resolve: ({ source }) =>
            jwt.sign(
                {
                    user_id: source.id,
                },
                credentials.api_secret
            ),
    });
