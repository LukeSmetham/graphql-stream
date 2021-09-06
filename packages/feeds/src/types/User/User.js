import { composer } from 'schema';

import { getToken } from './resolvers';

export const createUserTC = opts => {
    const schemaComposer = opts.schemaComposer || composer;

    const UserTC = schemaComposer.getOrCreateOTC(`StreamUser`, tc => {
        tc.addFields({
            id: 'ID!',
            data: 'JSON',
            created_at: 'DateTime!',
            updated_at: 'DateTime!',
        });
    });

    return UserTC;
};
