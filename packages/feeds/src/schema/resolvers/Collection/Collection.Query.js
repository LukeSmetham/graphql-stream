export const Query = {
    get: async (_, { collection, id }, { stream: { feeds } }) => {
        try {
            const { data } = await feeds.collections.get(collection, id);

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
