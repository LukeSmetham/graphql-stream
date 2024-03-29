import { composer } from 'schema';
import castArray from 'lodash.castarray';
import { ensureScalars } from 'utils/ensureScalars';

import { createActivityInterfaces } from 'interfaces/Activity';
import { createCollectionInterfaces } from 'interfaces/Collection';

import { createFeedTC } from 'types/Feed';
import { createActivityReactionTC } from 'types/ActivityReaction';
import { createCollectionTC } from 'types/Collection';
import { createUserTC } from 'types/User';

export const composeActivityFeed = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;
    const { collection, feed } = opts;

    ensureScalars(schemaComposer);

    // Create interface types
    createActivityInterfaces(schemaComposer);
    createCollectionInterfaces(schemaComposer);

    // Cast feed & collection property to an array if it's not already an array and add the feedGroupName to each
    const options = {
        ...opts,
        feed: castArray(feed || []),
        collection: castArray(collection || []),
        schemaComposer,
    };

    // Feeds
    // Create the various feed and activity types & resolvers for each feed config object.
    let feeds = {};

    for (let i = 0; i < options.feed.length; i++) {
        const FeedTC = createFeedTC({
            ...options,
            feed: options.feed[i],
        });

        feeds = {
            ...feeds,
            [`${FeedTC.getTypeName()}TC`]: FeedTC,
        };
    }

    // Reactions
    // Create ActivityReaction types and resolvers
    const StreamActivityReactionTC = createActivityReactionTC(options);

    // Users
    // Create StreamUser types and resolvers
    const StreamUserTC = createUserTC(options);

    // Collections
    // Create the various Collection types & resolvers for each collection config object.
    let collections = {};

    for (let i = 0; i < options.collection.length; i++) {
        const CollectionTC = createCollectionTC({
            ...options,
            collection: options.collection[i],
        });

        collections = {
            ...collections,
            [`${CollectionTC.getTypeName()}TC`]: CollectionTC,
        };
    }

    return {
        interfaces: {
            StreamCollectionEntityInterface: schemaComposer.getIFTC('StreamCollectionEntityInterface'),
            StreamActivityInterface: schemaComposer.getIFTC('StreamActivityInterface'),
            StreamGroupedActivityInterface: schemaComposer.getIFTC('StreamGroupedActivityInterface'),
        },
        ...feeds,
        ...collections,
        [`${StreamUserTC.getTypeName()}TC`]: StreamUserTC,
        [`${StreamActivityReactionTC.getTypeName()}TC`]: StreamActivityReactionTC,
    };
};
