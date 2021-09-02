import { StreamID } from './StreamID';

const channelId = 'messaging:123';
const invalidChannelId = 'messaging:123:456';

describe('StreamID', () => {
    test('Converts a Stream "entity selector" (i.e. channelType:channelId or feedGroup:feedId) to a StreamID', () => {
        const streamId = new StreamID(channelId);
        const parts = [...streamId];

        expect(streamId).toBeInstanceOf(StreamID);
        expect(parts[0]).toBe('messaging');
        expect(parts[1]).toBe('123');
        expect(streamId.toString()).toBe(channelId);
    });

    test('Selector can be provided as an Array', () => {
        const selector = channelId.split(':');
        const streamId = new StreamID(selector);
        const parts = [...streamId];

        expect(streamId).toBeInstanceOf(StreamID);
        expect(parts[0]).toBe('messaging');
        expect(parts[1]).toBe('123');
        expect(streamId.toString()).toBe(channelId);
    });

    test('Throws an error if an invalid selector is provided', () => {
        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const streamId = new StreamID(invalidChannelId);
        }).toThrow(
            `Invalid Stream Selector provided: ${invalidChannelId}, must contain only two parts separated by a colon - feedType:feedId | channelType:channelId`
        );
    });

    test('Can return the parts of the StreamID selector separately via getters', () => {
        const streamId = new StreamID(channelId);

        expect(streamId.type).toBe('messaging');
        expect(streamId.id).toBe('123');
    });

    test('Can return the parts of the StreamID together without the colon', () => {
        const streamId = new StreamID(channelId);

        expect(streamId.together).toBe('messaging123');
    });

    test('Can return the parts of the StreamID as a uri/slug', () => {
        const streamId = new StreamID(channelId);

        expect(streamId.uri).toBe('messaging/123');
    });
});
