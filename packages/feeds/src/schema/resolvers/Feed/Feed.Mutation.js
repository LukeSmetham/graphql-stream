export const Mutation = {
    follow: {
        resolve: async (_, { feed, toFollow }, { stream: { feeds } }) => {
            try {
                await feeds.feed(...feed).follow(...toFollow);

                return toFollow;
            } catch (error) {
                return null;
            }
        },
    },
    unfollow: {
        resolve: async (_, { feed, toUnfollow, keepHistory }, { stream: { feeds } }) => {
            try {
                await feeds.feed(...feed).unfollow(...toUnfollow, { keepHistory });

                return toUnfollow;
            } catch (error) {
                return null;
            }
        },
    },
};
