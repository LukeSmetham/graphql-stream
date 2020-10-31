export const Feed = {
    activities: async ({ id }, { options }, { stream }) => {
        const feed = stream.feeds.feed(...id);

        const { results } = await feed.get(options);

        return results;
    },
    followerCount: async ({ id }, { slugs: followerSlugs }, { stream }) => {
        const feed = stream.feeds.feed(...id);

        try {
            const data = await feed.followStats({ followerSlugs });

            return data?.results?.followers || 0;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    followers: async ({ id }, _, { stream }) => {
        const data = await stream.feeds.feed(...id).followers();

        return data?.results?.length
            ? data.results.map(({ feed_id }) => ({
                  id: feed_id,
              }))
            : [];
    },
    following: async ({ id }, _, { stream }) => {
        const data = await stream.feeds.feed(...id).following();

        return data?.results?.length
            ? data.results.map(({ target_id }) => ({
                  id: target_id,
              }))
            : [];
    },
    followingCount: async ({ id }, { slugs: followingSlugs }, { stream }) => {
        const feed = stream.feeds.feed(...id);

        try {
            const data = await feed.followStats({ followingSlugs });

            return data?.results?.following || 0;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
