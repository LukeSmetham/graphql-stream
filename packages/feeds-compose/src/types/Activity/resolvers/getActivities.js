import request from 'utils/request';

/**
 * Creates the getActivities resolver, using the given activity type composer.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
export const getActivities = (tc, credentials) =>
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
