import { composer } from 'schema';

import * as resolvers from './resolvers';

export const createActivityReactionTC = options => {
	if (!options) {
		throw new Error('No options were provided to createActivityReactionTC');
	}

    const schemaComposer = options.schemaComposer || composer;

    const ActivityReactionTC = schemaComposer.createObjectTC({
		name: `StreamActivityReaction`,
		fields: {
			id: {
				type: 'ID!',
				description: 'The unique identifier for the reaction.',
			},
			kind: {
				type: 'String!',
				description: 'The type of reaction (e.g. like, comment, ...)',
			},
			activity_id: {
				type: 'ID!',
				description: 'The ID of the activity the reaction refers to.',
			},
			created_at: {
				type: 'DateTime!',
				description: 'The date representing when this reaction was created.',
			},
			updated_at: {
				type: 'DateTime!',
				description: 'The date representing when this reaction was updated.',
			},
			user_id: {
				type: 'String!',
				description: 'The ID of the user who created this reaction.',
			},
			data: {
				type: 'JSON',
				description: 'Additional data attached to the reaction',
			},
			target_feeds: {
				type: '[StreamID!]',
				description: 'The feeds that should receive a notification activity',
			},
			target_feeds_extra_data: {
				type: 'JSON',
				description: 'Additional data to attached to the notification activities',
			},
		}
	});

	// Add Resolvers to the TypeComposer
	Object.keys(resolvers).forEach(k => {
        ActivityReactionTC.addResolver(resolvers[k](ActivityReactionTC, options));
    });

	// Add Relational Fields
    ActivityReactionTC.addRelation('childReactions', {
        prepareArgs: {
            parent: /* istanbul ignore next */ source => source.id, 
        },
        projection: { id: true },
        resolver: () => ActivityReactionTC.getResolver('getReactions').clone({ name: 'getChildReactions' }).makeArgNullable('activity'),
        description: 'Get the list of child reactions for this reaction',
    });

    return ActivityReactionTC;
};
