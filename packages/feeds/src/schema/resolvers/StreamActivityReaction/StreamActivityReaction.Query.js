export const Query = {
    reactions: {
        resolve: async (source, { activity, kind, parent, user, options = {} }, { stream }) => {
            const { results } = await stream.feeds.reactions.filter({
				activity_id: activity,
				user_id: user,
				reaction_id: parent,
				kind,
				...options,
			});

            return results;
        },
    },
};
