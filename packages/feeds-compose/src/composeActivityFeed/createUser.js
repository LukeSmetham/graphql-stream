import { createUserTC } from 'types/User';

import * as resolvers from 'types/User/resolvers';

export const createUser = options => {
    const UserTC = createUserTC(options);

    Object.keys(resolvers).forEach(k => {
        UserTC.addResolver(resolvers[k](UserTC, options));
    });

    return UserTC;
};
