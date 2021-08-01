export const Mutation = {
    addReaction: {
        resolve: async (source, { kind, activity, data = {}, user }, { stream }) => {
			const reaction = await stream.feeds.reactions.add(kind, activity, data, { userId: user })
			return reaction;
        },
    },
};
