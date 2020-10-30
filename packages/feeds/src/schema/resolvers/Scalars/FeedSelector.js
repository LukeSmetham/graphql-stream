import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

// TODO list of banned characters, test the id in the validator below.
// eslint-disable-next-line no-unused-vars
const bannedCharacters = ['.'];

const validate = feedParts => {
    feedParts.filter(part => Boolean(part));

    if (feedParts.length !== 2) {
        throw new TypeError(`Invalid Feed Selector: ${feedParts}`);
    }

    return feedParts;
};

export const FeedSelector = new GraphQLScalarType({
    description: 'A Stream Feed selector, represented as a colon-separated feedSlug:feedId, or an object with slug and id string properties.',
    name: 'FeedSelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return validate(ast.value.split(':'));
            default:
                throw new GraphQLError(`FeedSelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: validate,
    serialize: validate,
});
