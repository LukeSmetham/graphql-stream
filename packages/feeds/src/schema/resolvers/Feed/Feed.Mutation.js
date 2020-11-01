export const Mutation = {
    follow: {
        resolve: async (_, { feed, toFollow }, { stream: { feeds } }) => {
            try {
                await feeds.feed(...feed).follow(...toFollow);

                return feeds.feed(...toFollow);
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    unfollow: {
        resolve: async (_, { feed, toUnfollow, keepHistory }, { stream: { feeds } }) => {
            try {
                await feeds.feed(...feed).unfollow(...toUnfollow, { keepHistory });

                return feeds.feed(...toUnfollow);
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
};
