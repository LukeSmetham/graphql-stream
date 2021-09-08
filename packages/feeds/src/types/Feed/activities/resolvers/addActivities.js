import request from 'utils/request';
import { checkCredentials } from 'middleware/checkCredentials';

export const addActivities = (tc, options) =>
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
				if (activity.to?.length) {
					activity.to = activity.to.map(to => to.toString());
				}

				return activity;
			});

			const { body } = await request({
				credentials: options.credentials,
				url: `feed/${args.feed.uri}`,
				method: 'POST',
				data: {
					activities,
				},
			});

			if (body.status_code !== undefined) {
				throw new Error(body.detail);
			}

			return body.activities;
        },
    })
	.withMiddlewares([checkCredentials(options)])
	.clone({ name: 'addActivities' });
