import { EntitySelector } from '../../scalars';

export const initializeFeed = (feedSlug, feedId, client) => {
    const feed = client.feed(feedSlug, feedId);
    const id = new EntitySelector(feed.id);

    return {
        id,
        signature: `${id.together} ${feed.token}`,
        token: feed.token,
    };
};
