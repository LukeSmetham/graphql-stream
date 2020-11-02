import { EntitySelector } from '@graphql-stream/shared';
import { initializeFeed } from '../../../utils';

export const Feed = {
    activities: async ({ id }, { options }, { stream }) => {
        try {
            const feed = stream.feeds.feed(...id);

            const { results } = await feed.get(options);

            return results;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    /** Only allowed on the server, so needs its own request sig (different from source.signature) */
    followerCount: async ({ id }, { slugs: followerSlugs }, { stream }) => {
        const qs = {
            followers: id.toString(),
        };

        if (followerSlugs?.length) {
            qs.follower_slugs = followerSlugs.join(',');
        }

        try {
            const data = await stream.feeds.get({
                qs,
                signature: `${id.together} ${stream.feeds.getOrCreateToken()}`,
                url: '/stats/follow/',
            });

            return data?.results?.followers?.count || 0;
        } catch (error) {
            if (!stream.feeds.usingApiSecret) {
                // eslint-disable-next-line no-console
                console.warn('Follow Stats are only available on the server. Contact support to enable in client-side.');
            }

            return null;
        }
    },
    followers: async ({ id }, _, { stream }) => {
        try {
            const data = await stream.feeds.feed(...id).followers();

            return data?.results?.length ? data.results.map(({ feed_id }) => initializeFeed(new EntitySelector(feed_id), stream.feeds)) : [];
        } catch (error) {
            throw new Error(error.message);
        }
    },
    following: async ({ id }, _, { stream }) => {
        try {
            const data = await stream.feeds.feed(...id).following();

            return data?.results?.length
                ? data.results.map(({ target_id }) => initializeFeed(new EntitySelector(target_id), stream.feeds))
                : [];
        } catch (error) {
            throw new Error(error.message);
        }
    },
    /** Only allowed on the server, so needs its own request sig (different from source.signature) */
    followingCount: async ({ id }, { slugs: followingSlugs }, { stream }) => {
        const qs = {
            following: id.toString(),
        };

        if (followingSlugs?.length) {
            qs.following_slugs = followingSlugs.join(',');
        }

        try {
            const data = await stream.feeds.get({
                qs,
                signature: `${id.together} ${stream.feeds.getOrCreateToken()}`,
                url: '/stats/follow/',
            });

            return data?.results?.following?.count || 0;
        } catch (error) {
            if (!stream.feeds.usingApiSecret) {
                // eslint-disable-next-line no-console
                console.warn('Follow Stats are only available on the server. Contact support to enable in client-side.');
            }

            return null;
        }
    },
};
