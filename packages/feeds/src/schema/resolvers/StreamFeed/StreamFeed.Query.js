import { initializeFeed } from '../../../utils';

export const Query = {
    aggregatedFeed: {
        resolve: (_, { id }, { stream }) => initializeFeed(id, stream.feeds),
    },
    flatFeed: {
        resolve: (_, { id }, { stream }) => initializeFeed(id, stream.feeds),
    },
    notificationFeed: {
        resolve: (_, { id }, { stream }) => initializeFeed(id, stream.feeds),
    },
};
