/**
 * Creates the getFeed resolver, using the given feed type composer.
 * We only need to return the provided id arg, this allows the other siblings fields to access
 * it via the source property in their resolvers and make their own calls if they are requested.
 *
 * @param {TypeComposer} tc
 * @returns Resolver
 */
export const getFeed = tc =>
    tc.schemaComposer.createResolver({
        name: 'getFeed',
        type: tc,
        kind: 'query',
        args: { id: 'StreamID!' },
        resolve: ({ args }) => ({
            id: args.id,
        }),
    });
