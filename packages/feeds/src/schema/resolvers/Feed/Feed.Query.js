export const Query = {
    getFeed: {
        resolve: (_, { feed, slug, id }) => {
            if (!feed && (!slug || !id)) {
                throw new Error('Must provide a feed selector, or a slug and id');
            }
        },
    },
};
