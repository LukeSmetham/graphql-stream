import { composer } from 'schema';

import { createTokenField } from './fields';

export const createUserTC = opts => {
    const schemaComposer = opts.schemaComposer || composer;

    const UserTC = schemaComposer.getOrCreateOTC(`StreamUser`, tc => {
        tc.addFields({
            id: 'ID!',
            data: 'JSON',
            created_at: 'Date!',
            updated_at: 'Date!',
            token: createTokenField(schemaComposer, opts),
        });
    });

    return UserTC;
};
