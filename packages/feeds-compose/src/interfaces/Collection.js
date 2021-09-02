const collectionEntityInterfaceFields = {
    id: {
        type: 'ID!',
        description: 'The unique ID of this entity.',
    },
    collection: {
        type: 'String!',
        description: 'The collection name.',
    },
    foreign_id: {
        type: 'StreamID!',
        description: 'The StreamID representing this entity',
    },
    created_at: {
        type: 'DateTime!',
        description: 'The date this entity was created.',
    },
    updated_at: {
        type: 'DateTime!',
        description: 'The date this entity was updated.',
    },
};

const createCollectionInterfaces = schemaComposer => {
    if (!schemaComposer.has('StreamCollectionEntityInterface')) {
        const CollectionEntityIFTC = schemaComposer.createInterfaceTC({
            name: 'StreamCollectionEntityInterface',
            fields: collectionEntityInterfaceFields,
        });

        schemaComposer.addSchemaMustHaveType(CollectionEntityIFTC);
    }
};

export { collectionEntityInterfaceFields, createCollectionInterfaces };
