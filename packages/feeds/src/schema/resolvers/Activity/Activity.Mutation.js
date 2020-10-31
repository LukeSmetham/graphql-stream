export const Mutation = {
    addActivity: {
        resolve: (_, { feed, data }, { stream: { feeds } }) => {
            const activity = data;
            console.log(feed);
            if (activity.to?.length) {
                activity.to = activity.to.map(StreamSelector => StreamSelector.together);
            }

            return feeds.feed(...feed).addActivity(activity);
        },
    },
};
