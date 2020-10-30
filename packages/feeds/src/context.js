import { connect as streamFeedsClient } from 'getstream';

import { FeedsSubscription } from './subscriber';

export const streamFeedsContext = (appKey, appSecret, appId) => {
    if (!appKey || !appSecret) return {};

    const feeds = streamFeedsClient(appKey, appSecret, appId);

    return {
        feeds,
        FeedsSubscription,
    };
};
