import { createUserTC } from 'types/User';

import * as resolvers from 'types/User/resolvers';

export const createUser = options => {
    const UserTC = createUserTC(options);

    Object.keys(resolvers).forEach(k => {
        UserTC.addResolver(resolvers[k](UserTC, options));
    });

	UserTC.addRelation('token', {
		prepareArgs: {
			id: (source) => source.id,
		},
		projection: { id: true },
		resolver: () => UserTC.getResolver('getToken'),
	})

    return UserTC;
};
