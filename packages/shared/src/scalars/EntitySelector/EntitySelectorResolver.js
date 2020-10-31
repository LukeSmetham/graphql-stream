import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

import { EntitySelector } from './EntitySelector';

// TODO list of banned characters, test the id in the validator below.
// eslint-disable-next-line no-unused-vars
const bannedCharacters = ['.'];

const validate = data => {
    if (data instanceof EntitySelector) {
        return data;
    }

    return new EntitySelector(data);
};

export const EntitySelectorResolver = new GraphQLScalarType({
    description: 'A Stream Feed or Stream Chat Channel represented as a colon-separated value: "type:uid"',
    name: 'EntitySelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return validate(new EntitySelector(ast.value));
            default:
                throw new GraphQLError(`EntitySelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: validate,
    serialize: validate,
});
