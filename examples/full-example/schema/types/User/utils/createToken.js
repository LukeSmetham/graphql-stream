import jwt from 'jsonwebtoken';

export const createToken = (doc, aud = 'user') =>
    jwt.sign(
        {
            sub: doc._id.toString(),
            aud,
        },
        process.env.AUTH_SECRET,
    );