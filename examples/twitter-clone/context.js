/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their user data and token
 * to the context & set our mongoose models so we can access them
 * in our resolvers.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const authorizeRequest = async ({ req, connection }) => {
    try {
        let token;

        if (connection) {
            token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
        } else {
            token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
        }

        if (!token) {
            return {};
        }

        const { sub, aud: type } = jwt.verify(token, process.env.AUTH_SECRET);

        if (!sub) {
            return {};
        }

        return {
            [type]: sub,
        };
    } catch (error) {
        throw new AuthenticationError(error);
    }
};

export default async ({ connection, req }) => {
    const scope = await authorizeRequest({
        connection,
        req,
    });

    return {
        ...scope,
    };
};
