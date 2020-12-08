export const Mutation = {
    userCreate: async (_, args, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.user(args.id).create(args.data);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    userDelete: async (_, args, { stream: { feeds } }) => {
        try {
            await feeds.user(args.id).delete();

            return args.id;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    userUpdate: async (_, args, { stream: { feeds } }) => {
        try {
            const { id, data } = await feeds.user(args.id).update(args.data);

            return {
                ...data,
                id,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
