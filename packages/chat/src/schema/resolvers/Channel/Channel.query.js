export const Query = {
    channel: async (_, { id }, { stream }) => {
        const channel = stream.chat.channel(...id);

        await channel.watch();

        return {
            data: channel.data,
            id,
            state: channel.state,
        };
    },

};
