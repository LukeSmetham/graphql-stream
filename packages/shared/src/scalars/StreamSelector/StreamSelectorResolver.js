import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

// TODO list of banned characters, test the id in the validator below.
// eslint-disable-next-line no-unused-vars
const bannedCharacters = ['.'];

const validate = data => {
    if (data.length !== 2) {
        throw new TypeError('Incorrect FeedSelector Provided.');
    }

    return data;
};

export const StreamSelectorResolver = new GraphQLScalarType({
    description: 'A Stream Entity Selector (a feed or channel represented as a colon-separated value: "type:uid"',
    name: 'StreamSelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return validate(new StreamSelector(ast.value));
            default:
                throw new GraphQLError(`StreamSelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: validate,
    serialize: validate,
});
