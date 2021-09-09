export const me = tc =>
    tc.mongooseResolvers
        .findById()
        .removeArg('_id')
        .wrapResolve(next => rp => {
            const { user } = rp.context;

            // eslint-disable-next-line no-param-reassign
            rp.args._id = user;

            return next(rp);
        })
        .clone({ name: 'me' });
