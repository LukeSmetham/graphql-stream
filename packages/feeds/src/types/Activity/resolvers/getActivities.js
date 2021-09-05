import request from 'utils/request';

/**
 * Creates the getActivities resolver, using the given activity type composer.
 * @param {TypeComposer} tc
 * @returns Resolver
 */
export const getActivities = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'getActivities',
        type: [tc],
        kind: 'query',
        args: {
            feed: 'StreamID!',
			limit: 'Int',
			offset: 'Int',
			id_gt: 'ID',
			id_gte: 'ID',
			id_lt: 'ID',
			id_lte: 'ID',
        },
        resolve: async ({ args }) => {
			const { feed, ...params  } = args;
            try {
                const { body } = await request({
                    url: `feed/${feed.uri}`,
                    credentials,
					params,
                });

                return body.results;
            } catch (error) {
                console.error(error);
            }

            return [];
        },
    });
