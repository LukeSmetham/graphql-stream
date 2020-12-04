export const Query = {
    activities: {
        resolve: async (source, { feed, options }, { stream }) => {
            const { results } = await stream.feeds.feed(...(source?.id ? source.id : feed)).get(options);

            return results;
        },
    },
};
