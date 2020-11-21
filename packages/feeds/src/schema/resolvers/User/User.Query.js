export const Query = {
    user: async (_, args, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.user(args.id).get();

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    userGetOrCreate: async (_, args, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.user(args.id).getOrCreate(args.data);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
	}
};
