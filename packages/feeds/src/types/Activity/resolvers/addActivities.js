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

			const { body } = await request({
				url: `collections/${pluralize(collection.name)}/${args.id}`,
				credentials,
				method: 'PUT',
				data: {
					data: args.data,
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.activities;
        },
    });
