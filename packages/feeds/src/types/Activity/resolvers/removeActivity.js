import request from 'utils/request';

export const removeActivity = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'removeActivity',
        kind: 'mutation',
        type: 'String!',
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed to remove the activity from.',
            },
            id: {
                type: 'String!',
                description: 'The id or foreign_id of the activity to delete.',
            },
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    credentials,
                    url: `feed/${args.feed.uri}/${args.id}`,
                    method: 'DELETE',
                });

                return body.removed;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
