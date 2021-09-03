const activityInterfaceFields = {
    actor: {
        type: 'JSON',
        description: 'The actor performing the activity',
    },
    foreign_id: {
        type: 'String',
        description:
            'A unique ID from you application for this activity. i,e.: pin:1 or like:300. Required to later update activities by Time + Foreign ID.',
    },
    id: {
        type: 'ID!',
        description: 'The unique ID of this activity',
    },
    object: {
        type: 'JSON!',
        description: 'The object of the activity',
    },
    time: {
        type: 'DateTime',
        description:
            'The time of the activity, iso format (UTC local time). Required to ensure activity uniqueness and also to later update activities by Time + Foreign ID',
    },
    to: {
        type: '[StreamID!]',
        description: 'The target feeds this this activity was sent to',
    },
    verb: {
        type: 'String!',
        description: 'The verb describing the activity. (Max. length 255 bytes)',
    },
};

const activityInputFields = {
    actor: {
        type: 'JSON',
        description: 'The actor performing the activity',
    },
    foreign_id: {
        type: 'String',
        description:
            'A unique ID from you application for this activity. i,e.: pin:1 or like:300. Required to later update activities by Time + Foreign ID.',
    },
    object: {
        type: 'JSON!',
        description: 'The object of the activity',
    },
    time: {
        type: 'DateTime',
        description:
            'The time of the activity, iso format (UTC local time). Required to ensure activity uniqueness and also to later update activities by Time + Foreign ID',
    },
    to: {
        type: '[StreamID!]',
        description: 'The target feeds to send this activity to',
    },
    verb: {
        type: 'String!',
        description: 'The verb describing the activity. (Max. length 255 bytes)',
    },
};

const groupedActivityInterfaceFields = {
    activity_count: {
        type: 'Int!',
        description: 'The number of activities in the aggregated response.',
    },
    actor_count: {
        type: 'Int!',
        description: 'The number of actors in the aggregated response.',
    },
    created_at: {
        type: 'DateTime!',
        description: 'The date this activity group was created.',
    },
    group: {
        type: 'String!',
        description: 'The group this activity group belongs to.',
    },
    updated_at: {
        type: 'DateTime!',
        description: 'The date this activity group was updated.',
    },
    verb: {
        type: 'String!',
        description: 'The verb describing the activity group. (Max. length 255 bytes)',
    },
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
