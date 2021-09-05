import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { collectionEntityInterfaceFields } from 'interfaces/Collection';

export const createCollectionTC = (options = {}) => {
    const schemaComposer = options.schemaComposer || composer;

	const opts = deepmerge(options, {
		collection: {
			collectionName: capitalize(options.collection.name)
		}
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

    return {
        CollectionTC,
        EntityTC,
    };
};
