export const initializeFeed = (id, client) => {
    const feed = client.feed(...id);

    return {
        id,
        signature: `${id.together} ${feed.token}`,
        token: feed.token,
    };
};
