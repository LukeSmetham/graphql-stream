import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const getFollowers = (tc, options) =>
    tc.schemaComposer
        .createResolver({
            name: 'getFollowers',
            type: tc.schemaComposer
                .getOrCreateOTC('StreamFeedFollowPayload', type => {
                    type.addFields({
                        feed_id: 'StreamID!',
                        target_id: 'StreamID!',
                        created_at: 'DateTime!',
                        updated_at: 'DateTime!',
                    });
                })
                .getTypePlural(),
            kind: 'query',
            args: {
                feed: {
                    type: 'StreamID!',
                    description: 'The feed to fetch the followers for.',
                },
                limit: {
                    type: 'Int',
                    description: 'The amount of feeds following this feed requested from the API.',
                },
                offset: {
                    type: 'Int',
                    description: 'The offset, max 400',
                },
            },
            resolve: async ({ args: { feed, ...params } }) => {
                const { body } = await request({
                    url: `feed/${feed.uri}/followers`,
                    credentials: options.credentials,
                    params,
                });

                if (body.status_code !== undefined) {
                    throw new Error(body.detail);
                }

                return body.results;
            },
        })
        .withMiddlewares([checkCredentials(options)])
        .clone({ name: 'getFollowers' });
