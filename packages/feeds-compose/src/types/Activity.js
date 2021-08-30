import { composer } from 'schema';
import capitalize from 'capitalize';

const groupedActivityFields = {
    activity_count: 'Int!',
    actor_count: 'Int!',
    created_at: 'String!',
    group: 'String!',
    updated_at: 'String!',
    verb: 'String!',
};

export const createActivity = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;

    const { feedGroup = 'activity', activityFields, type } = opts;

    const feedGroupName = capitalize(feedGroup);
    const typeName = `Stream${feedGroupName}Activity`;

    const ActivityTC = schemaComposer.createObjectTC({
        name: typeName,
        fields: {
            actor: 'ID!',
            foreign_id: 'UUID',
            id: 'ID!',
            object: 'JSON!',
            time: 'String',
            to: '[StreamID!]',
            verb: 'String!',
            ...activityFields,
        },
    });

    if (type === 'aggregated') {
        return schemaComposer.createObjectTC({
            name: `Stream${feedGroupName}AggregatedActivity`,
            fields: {
                id: 'ID!',
                activities: [ActivityTC],
                ...groupedActivityFields,
            },
        });
    }

    if (type === 'notification') {
        return schemaComposer.createObjectTC({
            name: `Stream${feedGroupName}NotificationActivity`,
            fields: {
                id: 'ID!',
                activities: [ActivityTC],
                ...groupedActivityFields,
                is_read: 'Boolean!',
                is_seen: 'Boolean!',
            },
        });
    }

    return ActivityTC;
};
