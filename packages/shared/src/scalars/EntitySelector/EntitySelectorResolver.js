import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

import { EntitySelector } from './EntitySelector';

export const EntitySelectorResolver = new GraphQLScalarType({
    description: 'A Stream Feed or Stream Chat Channel represented as a colon-separated value: "type:uid"',
    name: 'EntitySelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return new EntitySelector(ast.value);
            default:
                throw new GraphQLError(`EntitySelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: data => {
        return new EntitySelector(data);
    },
    serialize: data => {
        return data.toString();
    },
});
