import { createUserTC } from 'types/User';

import { getUser } from 'types/User/resolvers';

export const createUsers = options => {
    const UserTC = createUserTC(options);

    return {
        UserTC,
        query: {
            getUser: () => getUser(UserTC, options),
            // getOrCreateUser: () => 'Stream',
        },
        mutation: {
            // addUser: () => 'Stream',
            // updateUser: () => 'Stream',
            // removeUser: () => 'Stream',
        },
        subscription: {},
    };
};
