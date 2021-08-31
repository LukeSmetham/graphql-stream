const activityInterfaceFields = {
    actor: 'ID!',
    foreign_id: 'String',
    id: 'ID!',
    object: 'JSON!',
    time: 'String',
    to: '[StreamID!]',
    verb: 'String!',
};

const activityInputFields = {
    actor: 'ID!',
    foreign_id: 'String',
    object: 'JSON!',
    time: 'String',
    to: '[StreamID!]',
    verb: 'String!',
};

const groupedActivityInterfaceFields = {
    activity_count: 'Int!',
    actor_count: 'Int!',
    created_at: 'String!',
    group: 'String!',
    updated_at: 'String!',
    verb: 'String!',
};

const createActivityInterfaces = schemaComposer => {
    if (!schemaComposer.has('StreamActivityInterface')) {
        const ActivityIFTC = schemaComposer.createInterfaceTC({
            name: 'StreamActivityInterface',
            fields: activityInterfaceFields,
        });

        schemaComposer.addSchemaMustHaveType(ActivityIFTC);
    }

    if (!schemaComposer.has('StreamGroupedActivityInterface')) {
        const GroupedActivityIFTC = schemaComposer.createInterfaceTC({
            name: 'StreamGroupedActivityInterface',
            fields: groupedActivityInterfaceFields,
        });

        schemaComposer.addSchemaMustHaveType(GroupedActivityIFTC);
    }
};

export { activityInterfaceFields, activityInputFields, groupedActivityInterfaceFields, createActivityInterfaces };
