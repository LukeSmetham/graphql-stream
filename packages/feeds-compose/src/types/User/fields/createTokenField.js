import jwt from 'jsonwebtoken';

const createTokenField = (schemaComposer, credentials) =>
    schemaComposer.createResolver({
        name: 'getToken',
        type: 'String!',
        kind: 'query',
        projection: { id: true },
        resolve: ({ source }) => {
            try {
                return jwt.sign(
                    {
                        user_id: source.id,
                    },
                    credentials.api_secret
                );
            } catch (error) {
                console.error(error.message);
            }

            return undefined;
        },
    });

export { createTokenField };
