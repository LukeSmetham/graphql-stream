import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

import { EntitySelector } from './EntitySelector';

const serialize = data => {
    if (data instanceof EntitySelector) {
        return data;
    }

    if (typeof data !== 'string' || !data.includes(':')) {
        return null;
    }

    if (data.split(':').length !== 2) {
        return null;
    }

    return new EntitySelector(data);
};

export const EntitySelectorResolver = new GraphQLScalarType({
    description: 'A Stream Feed or Stream Chat Channel represented as a colon-separated value: "type:uid"',
    name: 'EntitySelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return serialize(ast.value);
            default:
                throw new GraphQLError(`EntitySelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: serialize,
    serialize,
});
