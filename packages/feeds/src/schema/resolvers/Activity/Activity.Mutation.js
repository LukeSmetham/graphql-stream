export const Mutation = {
    addActivity: {
        resolve: (_, { feed, data }, { stream: { feeds } }) => {
            const activity = data;

            if (activity.to?.length) {
                activity.to = activity.to.map(feedSelector => feedSelector.together);
            }

            return feeds.feed(...feed).addActivity(activity);
        },
    },
};
