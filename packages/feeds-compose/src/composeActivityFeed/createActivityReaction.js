import { createActivityReactionTC } from 'types/ActivityReaction';
import * as resolvers from 'types/ActivityReaction/resolvers';

export const createActivityReaction = options => {
    const ActivityReactionTC = createActivityReactionTC(options);

    Object.keys(resolvers).forEach(k => {
        ActivityReactionTC.addResolver(resolvers[k](ActivityReactionTC, options));
    });

    ActivityReactionTC.addRelation('childReactions', {
        prepareArgs: {
            parent: source => source.id,
        },
        projection: { id: true },
        resolver: () => ActivityReactionTC.getResolver('getReactions').clone({ name: 'getChildReactions' }).makeArgNullable('activity'),
        description: 'Get the list of child reactions for this reaction',
    });

    return ActivityReactionTC;
};
