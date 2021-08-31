import request from 'utils/request';

export const addActivities = (tc, credentials) =>
    tc.schemaComposer.createResolver({
        name: 'addActivities',
        kind: 'mutation',
        type: [tc],
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed to add the activity to.',
            },
            activities: {
                type: [tc.getInputType()],
                description: 'The array of activities to add to the chosen feed.',
            },
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    credentials,
                    url: `feed/${args.feed.uri}`,
                    method: 'POST',
                    data: {
                        activities: args.activities,
                    },
                });

                return body.activities;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
