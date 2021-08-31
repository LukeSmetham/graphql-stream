import request from 'utils/request';

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
        args: {
            feed: 'StreamID!',
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    url: `feed/${args.feed.uri}`,
                    credentials,
                });

                return body.results;
            } catch (error) {
                console.error(error);
            }

            return [];
        },
    });

/**
 * Creates the getFeed resolver, using the given feed type composer.
 * We only need to return the provided id arg, this allows the other siblings fields to access
 * it via the source property in their resolvers and make their own calls if they are requested.
 *
 * @param {TypeComposer} tc
 * @returns Resolver
 */
const createGetFeed = tc =>
    tc.schemaComposer.createResolver({
        name: 'getFeed',
        type: tc,
        kind: 'query',
        args: { id: 'StreamID!' },
        resolve: ({ args }) => ({
            id: args.id,
        }),
    });

export { createGetActivities, createGetFeed };
