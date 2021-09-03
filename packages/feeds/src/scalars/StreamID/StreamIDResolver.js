import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

import { StreamID } from './StreamID';

export const StreamIDResolver = new GraphQLScalarType({
    description: 'A Stream Feed or Stream Chat Channel represented as a colon-separated value: "type:uid"',
    name: 'StreamID',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return new StreamID(ast.value);
            default:
                throw new GraphQLError(`StreamID must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: data => new StreamID(data),
    serialize: data => data.toString(),
});
