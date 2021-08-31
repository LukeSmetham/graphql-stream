import { composer } from 'schema';

import { activityInterfaceFields, activityInputFields, groupedActivityInterfaceFields } from 'interfaces/Activity';

const createActivity = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;

    const { feedGroupName, activityFields } = opts;

    const typeName = `Stream${feedGroupName}Activity`;

    // Creates Activity Type Composer incl. custom fields
    const ActivityTC = schemaComposer.createObjectTC({
        name: typeName,
        interfaces: [schemaComposer.getIFTC('StreamActivityInterface')],
        fields: {
            ...activityInterfaceFields,
            ...activityFields,
        },
    });

    schemaComposer.addSchemaMustHaveType(ActivityTC);

    // Creates ActivityInput Type Composer incl. custom fields
    const ActivityInputTC = schemaComposer.createInputTC({
        name: `${typeName}Input`,
        fields: {
            ...activityInputFields,
            ...activityFields,
        },
    });

    ActivityTC.setInputTypeComposer(ActivityInputTC);
    schemaComposer.addSchemaMustHaveType(ActivityInputTC);

    return ActivityTC;
};

const createGroupedActivity = (ActivityTC, opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;

    const { feedGroupName, type } = opts;

    let tc;

    if (type === 'aggregated') {
        tc = schemaComposer.createObjectTC({
            name: `Stream${feedGroupName}AggregatedActivity`,
            interfaces: [schemaComposer.getIFTC('StreamGroupedActivityInterface')],
            fields: {
                id: 'ID!',
                activities: [ActivityTC],
                ...groupedActivityInterfaceFields,
            },
        });
    }

    if (type === 'notification') {
        tc = schemaComposer.createObjectTC({
            name: `Stream${feedGroupName === 'Notification' ? 'Grouped' : feedGroupName}NotificationActivity`,
            interfaces: [schemaComposer.getIFTC('StreamGroupedActivityInterface')],
            fields: {
                id: 'ID!',
                activities: [ActivityTC],
                ...groupedActivityInterfaceFields,
                is_read: 'Boolean!',
                is_seen: 'Boolean!',
            },
        });
    }

    // If type is not defined and we are using "GroupedActivities", set the input composer to the ActivityInputTC
    // This is just a convenience so we can call GroupedActivityTC.getInputType() if necessary
    if (tc) {
        tc.setInputTypeComposer(ActivityTC.getInputType());
    }

    return tc;
};

export { createActivity, createGroupedActivity };
