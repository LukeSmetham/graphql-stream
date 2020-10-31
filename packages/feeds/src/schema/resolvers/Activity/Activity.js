export const Activities = {
    __resolveType: ({ activities, is_read, is_seen }) => {
        if (typeof is_read !== 'undefined' && typeof is_seen !== 'undefined') {
            return 'NotificationActivity';
        }

        if (activities) {
            return 'AggregatedActivity';
        }

        return 'Activity';
    },
};
