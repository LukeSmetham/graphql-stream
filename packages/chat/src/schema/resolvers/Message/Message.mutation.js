import { setChatUser } from '../../../utils';

export const Mutation = {
    sendMessage: {
        resolve: setChatUser((_, { channel, message }, { stream }) => {
            try {
                return stream.chat.channel(...channel).sendMessage({
                    ...message,
                    user_id: stream.chat.userId,
                })
            } catch (error) {
                console.log(error);
            }
        }
        ),
    },
};
