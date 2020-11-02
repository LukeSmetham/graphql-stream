import { initializeFeed } from '../../../utils';

export const Query = {
    /** Creates the 'source' object for all Feed fields */
    feed: {
        resolve: (_, { slug, id }, { stream }) => initializeFeed(slug, id, stream.feeds),
    },
};
