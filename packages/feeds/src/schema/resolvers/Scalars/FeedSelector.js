import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

// TODO list of banned characters, test the id in the validator below.
// eslint-disable-next-line no-unused-vars
const bannedCharacters = ['.'];

class StreamSelector extends Array {
    constructor(selector) {
        const parts = selector.split(':');

        if (parts?.length !== 2) {
            throw new TypeError(
                `Invalid Stream Selector provided: ${selector}, must contain only two parts. feedType:feedId | channelType:channelId`
            );
        }

        super(...parts);
    }

    get together() {
        return this.join(':');
    }
}

const validate = data => {
    if (data.length !== 2) {
        throw new TypeError('Incorrect FeedSelector Provided.');
    }

    return data;
};

export const FeedSelector = new GraphQLScalarType({
    description: 'A Stream Feed selector, represented as a colon-separated feedSlug:feedId, or an object with slug and id string properties.',
    name: 'FeedSelector',
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
                return validate(new StreamSelector(ast.value));
            default:
                throw new GraphQLError(`FeedSelector must be a string, you gave a: ${ast.kind}`);
        }
    },
    parseValue: validate,
    serialize: validate,
});
