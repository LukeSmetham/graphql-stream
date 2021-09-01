import { createUserTC } from 'types/User';

import { addUser, getUser, getOrCreateUser, removeUser, updateUser } from 'types/User/resolvers';

export const createUsers = options => {
    const UserTC = createUserTC(options);

    return {
        UserTC,
        query: {
            getUser: () => getUser(UserTC, options),
            getOrCreateUser: () => getOrCreateUser(UserTC, options),
        },
        mutation: {
            addUser: () => addUser(UserTC, options),
            updateUser: () => updateUser(UserTC, options),
            removeUser: () => removeUser(UserTC, options),
        },
        subscription: {},
    };
};
