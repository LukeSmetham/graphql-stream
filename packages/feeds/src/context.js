import { connect as feedsClient } from 'getstream';

import { FeedSubscription } from './subscriber';

export const createFeedsContext = (appKey, appSecret, appId) => {
    if (!appKey || !appSecret) return {};

    const feeds = feedsClient(appKey, appSecret, appId);

    return {
        feeds,
        FeedSubscription,
    };
};
