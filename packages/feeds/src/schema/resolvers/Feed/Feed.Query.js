import { EntitySelector } from '@graphql-stream/shared';

export const Query = {
    /** Creates the 'source' object for all Feed fields */
    feed: {
        resolve: (_, { slug, id }) => ({ id: new EntitySelector(`${slug}:${id}`) }),
    },
};
