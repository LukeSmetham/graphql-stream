import { composeActivityFeed } from './composeActivityFeed';
import capitalize from 'capitalize';
import castArray from 'lodash.castarray';

import { composer } from 'schema';
import { camelCase } from 'graphql-compose';

const createResolverName = (original, name) => original.replace(/([a-z])([A-Z])/gu, camelCase(`$1${name}$2`));
const globalFeedResolvers = new Set(['follow', 'unfollow', 'getFollowers', 'getFollowersCount', 'getFollowing', 'getFollowingCount']);

export const createActivityFeedSchema = options => {
    const schemaComposer = options.schemaComposer || composer;
    const { StreamActivityReactionTC, StreamUserTC, ...tcs } = composeActivityFeed(options);

    const feedGroups = castArray(options.feed || []).map(({ feedGroup: name }) => capitalize(name, true));
    const collections = castArray(options.collection || []).map(({ name }) => capitalize(name, true));

    for (const feedGroupName of feedGroups) {
        for (const [name, resolver] of tcs[`Stream${feedGroupName}FeedTC`].getResolvers().entries()) {
            schemaComposer[capitalize(resolver.kind)].addFields({
                [globalFeedResolvers.has(name) ? name : createResolverName(name, feedGroupName)]: resolver,
            });
        }
    }

    for (const collectionName of collections) {
        for (const [name, resolver] of tcs[`Stream${collectionName}EntityTC`].getResolvers().entries()) {
            schemaComposer[capitalize(resolver.kind)].addFields({
                [createResolverName(name, collectionName)]: resolver,
            });
        }
    }

    for (const [name, resolver] of StreamActivityReactionTC.getResolvers().entries()) {
        schemaComposer[capitalize(resolver.kind)].addFields({
            [name]: resolver,
        });
    }

    for (const [name, resolver] of StreamUserTC.getResolvers().entries()) {
        schemaComposer[capitalize(resolver.kind)].addFields({
            [name]: resolver,
        });
    }

    return schemaComposer.buildSchema();
};
