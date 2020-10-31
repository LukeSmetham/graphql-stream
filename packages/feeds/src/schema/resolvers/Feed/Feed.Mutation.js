export const Mutation = {
    follow: {
        resolve: async (_, { feed, toFollow }, { stream: { feeds } }) => {

            const res = await feeds.feed(...feed).follow(...toFollow);

            return res;
        },
    },
    unfollow: {
        resolve: (_, { feed, toUnfollow }, { stream: { feeds } }) => feeds.feed(...feed).unfollow(...toUnfollow),
    },
};
