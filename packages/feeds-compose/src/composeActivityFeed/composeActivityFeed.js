import { composer } from 'schema';
import capitalize from 'capitalize';
import castArray from 'lodash.castarray';

import { createActivityInterfaces } from 'interfaces/Activity';

import { ensureScalars } from './ensureScalars';
import { createActivityFeed } from './createActivityFeed';
import { createActivityReactions } from './createActivityReactions';
import { createUsers } from './createUsers';

export const composeActivityFeed = (opts = {}) => {
    const schemaComposer = opts.schemaComposer || composer;
    const { feed } = opts;

    ensureScalars(schemaComposer);

    // Create interface types
    createActivityInterfaces(schemaComposer);

    // Cast feed property to an array if it's not already an array and add the feedGroupName to each
    const options = {
        ...opts,
        feed: castArray(feed).map(feedConfig => ({
            ...feedConfig,
            feedGroupName: capitalize(feedConfig.feedGroup),
        })),
        schemaComposer,
    };

    // Create the various feed and activity types & resolvers for each feedConfig object.
    let feeds = {};

    for (let i = 0; i < options.feed.length; i++) {
        const feedTypes = createActivityFeed({
            ...options,
            feed: options.feed[i],
        });

        feeds = {
            ...feeds,
            ...feedTypes,
        };
    }

    // Create ActivityReaction types and resolvers
    const StreamActivityReactionsTC = createActivityReactions(options);

    // Create StreamUser types and resolvers
    const StreamUserTC = createUsers(options);

    // TODO: Collection resolvers
    return {
        interfaces: {
            StreamActivityInterface: schemaComposer.getIFTC('StreamActivityInterface'),
            StreamGroupedActivityInterface: schemaComposer.getIFTC('StreamGroupedActivityInterface'),
        },
        ...feeds,
        StreamUserTC,
        StreamActivityReactionsTC,
        // collections: {
        //     query: {},
        //     mutation: {},
        //     subscription: {},
        // },
    };
};
