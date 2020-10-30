export const Query = {
    feed: {
        resolve: async (_, { feed, slug, id, ...options }, { stream }) => {
            if (!slug || !id) {
                throw new Error('Must provide a feed selector, or a slug and id');
            }

            const { results } = await stream.feeds.feed(slug, id).get(options);

            return results;
        },
    },
};
