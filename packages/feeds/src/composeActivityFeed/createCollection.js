import { composer } from 'schema';

import { createCollectionTC } from 'types/Collection';

import * as resolvers from 'types/Collection/resolvers';

export const createCollection = options => {
    if (!options.collection.name) {
        throw new Error('Please provide the name of your Collection to opts.name.');
    }

    if (!Object.keys(options.collection.fields).length) {
        throw new Error(`No fields were provided for the ${options.collection.name} collection.`);
    }

    // Create TypeComposers
    const CollectionTC = createCollectionTC(options);

    Object.keys(resolvers).forEach(k => {
        CollectionTC.addResolver(resolvers[k](CollectionTC, options));
    });

    return CollectionTC;
};
