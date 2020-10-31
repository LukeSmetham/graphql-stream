import { EntitySelector } from '@graphql-stream/shared';

/**
 * Takes a FeedID and Token and returns a suitable source doc that will
 * enable all other fields of a Feed to resolve
 */
const prepareFeed = (feed, token) => {
    const id = new EntitySelector(feed);

    return {
        id,
        signature: `${id.together} ${token}`,
    };
};

export const Feed = {
    activities: async ({ id }, { options }, { stream }) => {
        const feed = stream.feeds.feed(...id);

        const { results } = await feed.get(options);

        return results;
    },
    followerCount: async ({ id, signature }, { slugs: followerSlugs }, { stream }) => {
        const qs = {
            followers: id.toString(),
        };

        if (followerSlugs?.length) {
            qs.follower_slugs = followerSlugs.join(',');
        }

        try {
            const data = await stream.feeds.get({
                qs,
                signature,
                url: '/stats/follow/',
            });

            return data?.results?.followers?.count || 0;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    followers: async ({ id }, _, { stream }) => {
        const data = await stream.feeds.feed(...id).followers();

        return data?.results?.length ? data.results.map(({ feed_id }) => prepareFeed(feed_id, stream.feeds.getOrCreateToken())) : [];
    },
    following: async ({ id }, _, { stream }) => {
        const data = await stream.feeds.feed(...id).following();

        return data?.results?.length ? data.results.map(({ target_id }) => prepareFeed(target_id, stream.feeds.getOrCreateToken())) : [];
    },
    followingCount: async ({ id, signature }, { slugs: followingSlugs }, { stream }) => {
        const qs = {
            following: id.toString(),
        };

        if (followingSlugs?.length) {
            qs.following_slugs = followingSlugs.join(',');
        }

        try {
            const data = await stream.feeds.get({
                qs,
                signature,
                url: '/stats/follow/',
            });

            return data?.results?.following?.count || 0;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    id: ({ id }, { slug: feedSlug, id: feedId }) => {
        if (id instanceof EntitySelector) return id;

        if (!id && feedSlug && feedId) {
            return new EntitySelector(`${feedSlug}:${feedId}`);
        }

        return id;
    },
};
