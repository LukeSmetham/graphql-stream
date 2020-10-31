export const Feed = {
    __resolveType: source => {
        if (typeof source?.unseen !== 'undefined' && typeof source?.unread !== 'undefined') {
            return 'AggregatedFeed';
        }

        return 'FlatFeed';
    },
};
