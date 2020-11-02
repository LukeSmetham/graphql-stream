export const setChatUser = (r, selector = 'user') => (source, args, context, info) => {
    const { stream } = context;

    if (!context[selector]) {
        throw new Error(`No user ID at context.${selector}`);
    }

    stream.chat.setUser({
        id: context[selector],
    });

    return r(source, args, context, info);
};
