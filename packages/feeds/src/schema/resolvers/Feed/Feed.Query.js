export const Query = {
    feed: {
        resolve: async (_, { slug, id, ...options }, { stream }) => {
            if (!slug || !id) {
                throw new Error('Must provide a feed selector, or a slug and id');
            }

            const feed = stream.feeds.feed(slug, id);

            const { results } = await feed.get(options);

            return results;
        },
    },
};
