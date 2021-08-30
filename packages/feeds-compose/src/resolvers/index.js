import phin from 'phin';
import jwt from 'jsonwebtoken';

const tokenPayload = {
    resource: '*',
    action: '*',
    feed_id: '*',
};

const get = (url, credentials) =>
    phin({
        url: `https://api.stream-io-api.com/api/v1.0${url}?api_key=${credentials.api_key}`,
        method: 'GET',
        parse: 'json',
        headers: {
            Authorization: `Bearer ${jwt.sign(tokenPayload, credentials.api_secret)}`,
            'Stream-Auth-Type': 'jwt',
            'Content-Type': 'application/json',
        },
        timeout: 5000,
    });

/**
 * Creates the getActivities resolver, using the given activity type composer.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetActivities = (tc, credentials) =>
    tc.schemaComposer.createResolver({
        name: 'getActivities',
        type: [tc],
        kind: 'query',
        resolve: async ({ source }) => {
            const feedSlug = source.id.join('/');
            const feedUrl = `/feed/${feedSlug}/followers`;

            try {
                const res = await get(feedUrl, credentials);

                console.log(res.body);
            } catch (error) {
                console.log(error);
            }

            return [
                {
                    id: 0,
                    actor: 0,
                    verb: 'post',
                    object: 'video',
                    src: 'https://video.com',
                },
            ];
        },
    });

/**
 * Creates the getFeed resolver, using the given feed type composer.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeed = (tc, credentials) =>
    tc.schemaComposer.createResolver({
        name: 'getFeed',
        type: tc,
        kind: 'query',
        args: { id: 'StreamID!' },
        resolve: ({ args }) => ({
            id: args.id,
            followerCount: 0,
            followingCount: 0,
        }),
    });

export { createGetActivities, createGetFeed };
