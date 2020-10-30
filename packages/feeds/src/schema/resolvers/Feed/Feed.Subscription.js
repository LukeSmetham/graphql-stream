export const Subscription = {
    realtimeFeed: {
        resolve: data => data,
        subscribe: (_, { slug, id }, { stream }) => new stream.FeedSubscription(stream.feeds).asyncIterator(`${slug}:${id}`),
    },
};
