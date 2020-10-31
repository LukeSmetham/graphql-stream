const getFeedActivities = async (_, { slug, id, options }, { stream }) => {
    if (!slug || !id) {
        throw new Error('Must provide a feed selector, or a slug and id');
    }

    const feed = stream.feeds.feed(slug, id);

    const { results } = await feed.get(options);

    return results;
};

export const Query = {
    aggregatedFeed: {
        resolve: getFeedActivities,
    },
    feed: {
        resolve: getFeedActivities,
    },
    flatFeed: {
        resolve: getFeedActivities,
    },
    notificationFeed: {
        resolve: getFeedActivities,
    },
};
