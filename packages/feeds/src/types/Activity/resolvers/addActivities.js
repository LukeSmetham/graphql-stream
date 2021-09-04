import request from 'utils/request';

export const addActivities = (tc, { credentials } = {}) =>
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
				const activities = args.activities.map(activity => {
					if (activity.to.length) {
						activity.to = activity.to.map(to => to.toString());
					}

					return activity;
				});

                const { body } = await request({
                    credentials,
                    url: `feed/${args.feed.uri}`,
                    method: 'POST',
                    data: {
                        activities,
                    },
                });
				console.log(body);
                return body.activities;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
