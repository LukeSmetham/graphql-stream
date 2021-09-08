import { composer } from 'schema';

import * as resolvers from './resolvers';

export const createUserTC = options => {
	if (!options) {
		throw new Error('No options were provided to createUserTC');
	}

    const schemaComposer = options.schemaComposer || composer;

    const UserTC = schemaComposer.createObjectTC({
		name: 'StreamUser',
		fields: {
			id: 'ID!',
			data: 'JSON',
			created_at: 'DateTime!',
			updated_at: 'DateTime!',
		}
	});

	// Add resolvers to the TypeComposer
	Object.keys(resolvers).forEach(k => {
        UserTC.addResolver(resolvers[k](UserTC, options));
    });

	// Add Relational Fields
	UserTC.addRelation('token', {
		prepareArgs: {
			id: /* istanbul ignore next */ source => source.id,
		},
		projection: { id: true },
		resolver: () => UserTC.getResolver('getToken'),
	})

    return UserTC;
};
