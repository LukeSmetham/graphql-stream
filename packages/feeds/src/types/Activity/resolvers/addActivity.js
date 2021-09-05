import request from 'utils/request';

export const addActivity = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'addActivity',
        kind: 'mutation',
        type: tc,
        args: {
            feed: {
                type: 'StreamID!',
                description: 'The feed to add the activity to.',
            },
            activity: {
                type: tc.getInputType(),
                description: 'The activity to add to the chosen feed.',
            },
        },
        resolve: async ({ args }) => {
            try {
				const activity = args.activity;

				if (activity.to?.length) {
					activity.to = activity.to.map(to => to.toString());
				}

                const { body } = await request({
                    credentials,
                    url: `feed/${args.feed.uri}`,
                    method: 'POST',
                    data: args.activity,
                });

                return body;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
