export const Query = {
    get: async (_, { collection, id: entryId }, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.collections.get(collection, entryId);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
