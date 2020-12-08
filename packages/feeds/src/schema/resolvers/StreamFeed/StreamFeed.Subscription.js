export const Subscription = {
    realtimeFeed: {
        resolve: data => data,
        subscribe: (_, { feed }, { stream }) => new stream.FeedSubscription(stream.feeds).asyncIterator(feed.toString()),
    },
};
