import bcrypt from 'bcrypt';
import { deepmerge } from 'graphql-compose';
import { createToken } from '../utils/createToken';

// Here we re-use the findOne resolver, remove its original args from being exposed to the user
// and add new ones for email and password.
export const login = (tc) =>
    tc.mongooseResolvers
		.findOne()
		.removeArg('record')
		.removeArg('filter')
		.removeArg('sort')
		.removeArg('skip')
        .addArgs({
            email: 'String!',
            password: 'String!',
        })
        .wrapResolve((next) => async (rp) => {
            const data = await next(
                deepmerge(rp, {
                    args: {
                        filter: {
                            email: rp.args.email,
                        },
                    },
                    projection: {
                        _id: true,
                        password: true,
                    },
                }),
            );

			if (!data) {
				throw new Error('An account with that email does not exist.')
			}

            const valid = await bcrypt.compare(rp.args.password, data.password);

            if (!valid) {
                throw new Error('Incorrect password.');
            }

            delete data.password;

            data.token = createToken(data);

            return data;
        })
        .clone({ name: 'login' });