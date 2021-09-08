import { deepmerge } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { activityInterfaceFields, activityInputFields, groupedActivityInterfaceFields } from 'interfaces/Activity';

const addToActivityUnion = ActivityTC => {
	let createdUnion = false;
	const ActivityUTC = ActivityTC.schemaComposer.getOrCreateUTC('StreamActivity', tc => {
		createdUnion = true;
		tc.addType(ActivityTC)
	});

	if (!createdUnion) {
		ActivityUTC.addType(ActivityTC);
	}

	return ActivityUTC;
}

const createActivityTC = (options = {}) => {
    const schemaComposer = options.schemaComposer || composer;

	if (!options.feed) {
		throw new Error('No feed config provided.');
	}

	const opts = deepmerge(options, {
		feed: {
			feedGroupName: capitalize(options.feed.feedGroup)
		}
	})

    const { feedGroupName, activityFields } = opts.feed;

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

const createGroupedActivityTC = (ActivityTC, options = {}) => {
    const schemaComposer = options.schemaComposer || composer;

	if (!options.feed) {
		throw new Error('No feed config provided.');
	}

	const opts = deepmerge(options, {
		feed: {
			feedGroupName: capitalize(options.feed.feedGroup)
		}
	})

    const { feedGroupName, type } = opts.feed;

	const ActivityUTC = addToActivityUnion(ActivityTC);

    let tc;

    if (type === 'aggregated') {
        tc = schemaComposer.createObjectTC({
            name: `Stream${feedGroupName}ActivityGroup`,
            interfaces: [schemaComposer.getIFTC('StreamGroupedActivityInterface')],
            fields: {
                id: 'ID!',
                activities: {
                    type: [ActivityUTC],
                    description: 'The list of activities for this aggregated response.',
                },
                ...groupedActivityInterfaceFields,
            },
        });
    }

    if (type === 'notification') {
        tc = schemaComposer.createObjectTC({
            name: `Stream${feedGroupName}ActivityGroup`,
            interfaces: [schemaComposer.getIFTC('StreamGroupedActivityInterface')],
            fields: {
                id: 'ID!',
                activities: {
                    type: [ActivityUTC],
                    description: 'The list of activities for this aggregated response.',
                },
                ...groupedActivityInterfaceFields,
                is_read: {
                    type: 'Boolean!',
                    description: 'Flag showing whether this notification group has been read.',
                },
                is_seen: {
                    type: 'Boolean!',
                    description: 'Flag showing whether this notification group has been seen.',
                },
            },
        });
    }

    return tc;
};

export { createActivityTC, createGroupedActivityTC };
