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

// NOTE: Adding Resolvers as below, we can make it easy for devs to pull types out of the store from anywhere in there server code.
// Branch off and test this out with the Feed and Activity types too.
//
// import * as resolvers from 'types/User/resolvers';

// export const createUsers = options => {
//     const UserTC = createUserTC(options);

//     Object.keys(resolvers).forEach(k => {
//         UserTC.addResolver(resolvers[k](UserTC, options));
//     });

//     return UserTC;
// };
