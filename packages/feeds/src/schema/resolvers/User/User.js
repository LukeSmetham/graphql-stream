export const User = {
    token: (source, _, { stream: { feeds } }) => (feeds.usingApiSecret ? feeds.createUserToken(source.id) : null),
};
