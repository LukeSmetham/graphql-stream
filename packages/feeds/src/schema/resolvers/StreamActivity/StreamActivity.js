export const StreamActivityUnion = {
    __resolveType: ({ activities, is_read, is_seen }) => {
        if (typeof is_read !== 'undefined' && typeof is_seen !== 'undefined') {
            return 'StreamNotificationActivity';
        }

        if (activities) {
            return 'StreamAggregatedActivity';
        }

        return 'StreamActivity';
    },
};
