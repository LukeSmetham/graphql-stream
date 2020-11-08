import { StreamChat as StreamChatClient } from 'stream-chat';

import { ChatSubscription } from './subscriber';

export const createChatContext = (appKey, appSecret) => {
    if (!appKey || !appSecret) return {};

    const chat = new StreamChatClient(appKey, appSecret);

    return {
        chat,
        ChatSubscription,
    };
};
