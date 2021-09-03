import request from 'utils/request';

export const addReaction = (tc, { credentials } = {}) =>
    tc.schemaComposer.createResolver({
        name: 'addReaction',
        type: tc,
        kind: 'mutation',
        args: {
            activity: {
                type: 'UUID!',
                description: 'The activity to fetch reactions for.',
            },
            kind: {
                type: 'String!',
                description: 'The type of reaction (e.g. "like", "comment", etc.)',
            },
            data: {
                type: 'JSON',
                description: 'The extra data for the new reaction.',
            },
            user: {
                type: 'String!',
                description: 'The user performing the reaction.',
            },
            parent: {
                type: 'UUID',
                description: 'The ID to make the new reaction a child of. The passed reaction ID must not have a parent itself.',
            },
        },
        resolve: async ({ args }) => {
            try {
                const { body } = await request({
                    credentials,
                    url: `reaction`,
                    method: 'POST',
                    data: {
                        activity_id: args.activity,
                        kind: args.kind,
                        data: args.data,
                        user_id: args.user,
                        parent: args.parent,
                    },
                });

                console.log(body);

                return body;
            } catch (error) {
                console.error(error.message);

                return undefined;
            }
        },
    });
