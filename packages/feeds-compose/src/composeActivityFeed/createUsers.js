import { createUserTC } from 'types/User';

import { addUser, getUser, removeUser } from 'types/User/resolvers';

export const createUsers = options => {
    const UserTC = createUserTC(options);

    return {
        UserTC,
        query: {
            getUser: () => getUser(UserTC, options),
            // getOrCreateUser: () => 'Stream',
        },
        mutation: {
            addUser: () => addUser(UserTC, options),
            // updateUser: () => 'Stream',
            removeUser: () => removeUser(UserTC, options),
        },
        subscription: {},
    };
};
