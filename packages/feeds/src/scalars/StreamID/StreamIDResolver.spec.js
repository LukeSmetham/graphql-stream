import { Kind } from 'graphql';
import { StreamID } from './StreamID';
import { StreamIDResolver } from './StreamIDResolver';

const feedIdParts = ['timeline', '12345678'];
const feedId = feedIdParts.join(':'); // timeline:12345678

describe('StreamIDResolver', () => {
    describe('valid', () => {
        test('serialize', () => {
            expect(StreamIDResolver.serialize(feedId)).toBe(feedId);
        });

        test(`parseValue`, () => {
            const value = StreamIDResolver.parseValue(feedId);

            expect(value).toBeInstanceOf(StreamID);
            expect(value[0]).toStrictEqual(feedIdParts[0]);
            expect(value[1]).toStrictEqual(feedIdParts[1]);
        });

        test('parseLiteral', () => {
            const value = StreamIDResolver.parseLiteral(
                {
                    value: feedId,
                    kind: Kind.STRING,
                },
                {}
            );

            expect(value).toBeInstanceOf(StreamID);
            expect(value[0]).toStrictEqual(feedIdParts[0]);
            expect(value[1]).toStrictEqual(feedIdParts[1]);
        });
    });

    describe('invalid', () => {
        test('parseLiteral', () => {
            expect(() =>
                StreamIDResolver.parseLiteral(
                    {
                        value: true,
                        kind: Kind.BOOLEAN,
                    },
                    {}
                )
            ).toThrow(`StreamID must be a string, you gave a: ${Kind.BOOLEAN}`);
        });
    });
});
