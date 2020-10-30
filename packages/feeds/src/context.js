import { connect as streamFeedsClient } from 'getstream';

import { FeedSubscription } from './subscriber';

export const createFeedsContext = (appKey, appSecret, appId) => {
    if (!appKey || !appSecret) return {};

    const feeds = streamFeedsClient(appKey, appSecret, appId);

    return {
        feeds,
        FeedSubscription,
    };
};
