import { createFeedsContext } from '@graphql-stream/feeds';
import { createChatContext } from '@graphql-stream/chat';

export const createStreamContext = (appKey, appSecret, appId) => ({
    ...createFeedsContext(appKey, appSecret, appId),
    ...createChatContext(appKey, appSecret, appId),
});
