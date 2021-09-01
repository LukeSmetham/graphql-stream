import { composer } from 'schema';
import { camelCase } from 'graphql-compose';
import capitalize from 'capitalize';
import castArray from 'lodash.castarray';

import { createActivityInterfaces } from 'interfaces/Activity';

import { ensureScalars } from './ensureScalars';
import { createActivityFeed } from './createActivityFeed';
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
    const feeds = {};

    for (let i = 0; i < options.feed.length; i++) {
        const name = camelCase(`${options.feed[i].feedGroupName}Feed`);

        feeds[name] = createActivityFeed({
            ...options,
            feed: options.feed[i],
        });
    }

    const users = createUsers(options);

    // TODO: Collection resolvers
    // TODO: User Resolvers
    return {
        interfaces: {
            StreamActivityInterface: schemaComposer.getIFTC('StreamActivityInterface'),
            StreamGroupedActivityInterface: schemaComposer.getIFTC('StreamGroupedActivityInterface'),
        },
        feeds,
        users,
        collections: {
            query: {},
            mutation: {},
            subscription: {},
        },
    };
};
