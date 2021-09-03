import { composer } from 'schema';

import { composeActivityFeed } from '../composeActivityFeed';

export const createActivityFeedsSchema = (options, build = true) => {
    const schemaComposer = options.schemaComposer || composer;

    const activityFeeds = composeActivityFeed(options);

    return build ? schemaComposer.buildSchema() : schemaComposer;
};
