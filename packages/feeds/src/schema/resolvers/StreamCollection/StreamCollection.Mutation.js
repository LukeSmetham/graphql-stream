export const Mutation = {
    add: async (_, { collection, id: entryId, data: entry }, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.collections.add(collection, entryId, entry);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    delete: async (_, { collection, id: entryId }, { stream: { feeds } }) => {
        try {
            await feeds.collections.delete(collection, entryId);

            return entryId;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    update: async (_, { collection, id: entryId, data: entry }, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.collections.update(collection, entryId, entry);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
