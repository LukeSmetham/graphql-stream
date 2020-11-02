import { setChatUser } from '../../../utils';

export const Subscription = {
    channelEvents: {
        resolve: data => data,
        subscribe: setChatUser((_, { channel }, { stream, user }) =>
            new stream.ChatSubscription(stream.chat, user).asyncIterator(channel.toString())
        ),
    },
    clientEvents: {
        resolve: data => data,
        subscribe: setChatUser((_, __, { stream, user }) => new stream.ChatSubscription(stream.chat, user).asyncIterator('*')),
    },
};
