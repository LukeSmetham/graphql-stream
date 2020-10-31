export const Query = {
    activities: {
        resolve: async (_, { feed, options }, { stream }) => {
            const { results } = await stream.feeds.feed(...feed).get(options);

            return results;
        },
    },
};
