import { composer } from 'schema';

const reactionFields = {
    id: {
        type: 'UUID!',
        description: 'The unique identifier for the reaction.',
    },
    kind: {
        type: 'String!',
        description: 'The type of reaction (e.g. like, comment, ...)',
    },
    activity_id: {
        type: 'UUID!',
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
};

export const createActivityReactionTC = opts => {
    const schemaComposer = opts.schemaComposer || composer;

    const ActivityReactionTC = schemaComposer.getOrCreateOTC(`StreamActivityReaction`, tc => {
        tc.addFields(reactionFields);
    });

    return ActivityReactionTC;
};
