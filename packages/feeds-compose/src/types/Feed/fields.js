import request from 'utils/request';

/**
 * Creates the getFeedFollowers resolver.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeedFollowers = (schemaComposer, credentials) =>
    schemaComposer.createResolver({
        name: 'getFeedFollowers',
        type: '[StreamID!]',
        kind: 'query',
        args: {
            limit: {
                type: 'Int',
                description: 'The amount of feeds following this feed requested from the API.',
            },
            offset: {
                type: 'Int',
                description: 'The offset, max 400',
            },
        },
        resolve: async ({ source, args }) => {
            try {
                const { body } = await request({
                    url: `feed/${source.id.uri}/followers`,
                    credentials,
                    params: args,
                });

                return body.results.map(({ feed_id }) => feed_id);
            } catch (error) {
                console.error(error.message);
            }

            return undefined;
        },
    });

/**
 * Creates the getFeedFollowing resolver.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeedFollowing = (schemaComposer, credentials) =>
    schemaComposer.createResolver({
        name: 'getFeedFollowing',
        type: '[StreamID!]',
        kind: 'query',
        args: {
            limit: {
                type: 'Int',
                description: 'The amount of followed feeds requested from the API.',
            },
            offset: {
                type: 'Int',
                description: 'The offset, max 400',
            },
            filter: {
                type: '[StreamID]',
                description:
                    'List of comma separated feed ids to filter on. IE user:1,user:2. Allows you to check if a certain feed is followed.',
            },
        },
        resolve: async ({ source, args }) => {
            try {
                const { body } = await request({
                    url: `feed/${source.id.uri}/following`,
                    credentials,
                    params: args,
                });

                return body.results.map(({ feed_id }) => feed_id);
            } catch (error) {
                console.error(error.message);
            }

            return undefined;
        },
    });

/**
 * Creates the getFeedFollowersCount  resolver.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeedFollowersCount = (schemaComposer, credentials) =>
    schemaComposer.createResolver({
        name: 'getFeedFollowersCount',
        type: 'Int!',
        kind: 'query',
        resolve: async ({ source }) => {
            try {
                const { body } = await request({
                    url: `stats/follow`,
                    credentials,
                    params: {
                        followers: source.id.toString(),
                    },
                });

                return body.results.followers.count;
            } catch (error) {
                console.error(error.message);
            }
        },
    });

/**
 * Creates the getFeedFollowingCount resolver.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeedFollowingCount = (schemaComposer, credentials) =>
    schemaComposer.createResolver({
        name: 'getFeedFollowingCount',
        type: 'Int!',
        kind: 'query',
        resolve: async ({ source }) => {
            try {
                const { body } = await request({
                    url: `stats/follow`,
                    credentials,
                    params: {
                        following: source.id.toString(),
                    },
                });

                return body.results.following.count;
            } catch (error) {
                console.error(error.message);
            }
        },
    });

export { createGetFeedFollowers, createGetFeedFollowing, createGetFeedFollowersCount, createGetFeedFollowingCount };
