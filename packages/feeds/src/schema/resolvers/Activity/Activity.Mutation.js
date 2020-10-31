export const Mutation = {
    addActivity: {
        resolve: (_, { feed, data }, { stream: { feeds } }) => {
            const activity = data;

            if (activity.to?.length) {
                activity.to = activity.to.map(EntitySelector => EntitySelector.together);
            }

            return feeds.feed(...feed).addActivity(activity);
        },
    },
};
