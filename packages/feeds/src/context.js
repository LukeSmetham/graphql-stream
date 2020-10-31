import { connect as feedsCilent } from 'getstream';

import { FeedSubscription } from './subscriber';

export const createFeedsContext = (appKey, appSecret, appId) => {
    if (!appKey || !appSecret) return {};

    const feeds = feedsCilent(appKey, appSecret, appId);

    return {
        feeds,
        FeedSubscription,
    };
};
