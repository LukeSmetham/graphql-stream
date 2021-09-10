import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { collectionEntityInterfaceFields } from 'interfaces/Collection';
import * as resolvers from './resolvers';

export const createCollectionTC = options => {
    if (!options) {
        throw new Error('No options were provided to createCollectionTC');
    }

    const schemaComposer = options.schemaComposer || composer;

    const opts = deepmerge(options, {
        collection: {
            collectionName: capitalize(options.collection.name),
        },
    });

    const { collectionName, fields } = opts.collection;

    const typeName = `Stream${collectionName}Entity`;

    const EntityTC = schemaComposer.createObjectTC({
        name: `Stream${collectionName}`,
        fields,
    });

    const CollectionTC = schemaComposer.createObjectTC({
        name: typeName,
        interfaces: [schemaComposer.getIFTC('StreamCollectionEntityInterface')],
        fields: {
            ...collectionEntityInterfaceFields,
            data: EntityTC,
        },
    });

    CollectionTC.setInputTypeComposer(EntityTC.getInputTypeComposer());

    // Add the resolvers to the TypeComposer
    Object.keys(resolvers).forEach(k => {
        CollectionTC.addResolver(resolvers[k](CollectionTC, options));
    });

    return CollectionTC;
};
