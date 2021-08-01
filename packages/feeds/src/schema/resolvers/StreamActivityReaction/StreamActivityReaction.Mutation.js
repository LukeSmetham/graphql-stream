export const Mutation = {
    addReaction: {
        resolve: async (source, { kind, activity, data = {}, user }, { stream }) => {
			const reaction = await stream.feeds.reactions.add(kind, activity, data, { userId: user })
			return reaction;
        },
    },
    updateReaction: {
        resolve: async (source, { id, data }, { stream }) => {
			const reaction = await stream.feeds.reactions.update(id, data)
			return reaction;
        },
    },
    deleteReaction: {
        resolve: async (source, { id }, { stream }) => {
			try {
				await stream.feeds.reactions.delete(id);
				return true;
			} catch (error) {
				console.error(error.message);
				return false;
			}
        },
    },
};
