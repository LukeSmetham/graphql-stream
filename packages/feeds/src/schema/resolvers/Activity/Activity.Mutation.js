export const Mutation = {
    addActivity: {
        resolve: (_, { feed, activity }, { stream: { feeds } }) => {
            let { to } = activity;

            if (to?.length) {
                to = activity.to.map(selector => selector.together);
            }

            return feeds.feed(...feed).addActivity({
                ...activity,
                to,
            });
        },
    },
    removeActivity: (_, { feed, foreignId, id }, { stream: { feeds } }) => {
        if (!foreignId && !id) {
            throw new Error('No activity selector provided. Please provide an id or foreignId to the remove activity mutation.');
        }

        const { removed } = feeds.feed(...feed).removeActivity(id || { foreign_id: foreignId })

        return removed;
    },
};
