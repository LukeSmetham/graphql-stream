import { composer } from 'schema';
import capitalize from 'capitalize';

import { createCollectionTC } from 'types/Collection';

// import * as collectionResolvers from 'types/Collection/resolvers';

export const createCollection = options => {
    const schemaComposer = options.schemaComposer || composer;

    if (!options.collection.name) {
        throw new Error('Please provide the name of your Collection to opts.name.');
    }

    if (!Object.keys(options.collection.fields).length) {
        throw new Error(`No fields were provided for the ${options.collection.name} collection.`);
    }

    // Create TypeComposers
    const { CollectionTC, EntityTC } = createCollectionTC(options);

    return {
        [`${CollectionTC.getTypeName()}TC`]: CollectionTC,
        [`${EntityTC.getTypeName()}TC`]: EntityTC,
    };
};
