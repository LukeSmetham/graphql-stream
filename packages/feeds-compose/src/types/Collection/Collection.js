import { composer } from 'schema';

import { collectionEntityInterfaceFields } from 'interfaces/Collection';

export const createCollectionTC = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;

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

    return {
        CollectionTC,
        EntityTC,
    };
};
