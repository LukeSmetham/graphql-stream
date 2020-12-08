import { initializeFeed } from '../../../utils';

export const Query = {
    /** Creates the 'source' object for all Feed fields */
    feed: {
        resolve: (_, { id }, { stream }) => initializeFeed(id, stream.feeds),
    },
};
