import { EntitySelector } from '@graphql-stream/shared';

export const Query = {
    /** Creates the 'source' object for all Feed fields */
    feed: {
        resolve: (_, { slug, id }, { stream }) => {
            const feedSelector = new EntitySelector(`${slug}:${id}`);

            return {
                id: feedSelector,
                signature: `${feedSelector.together} ${stream.feeds.getOrCreateToken()}`,
            };
        },
    },
};
