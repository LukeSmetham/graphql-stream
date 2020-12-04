export class StreamID extends Array {
    constructor(selector) {
        let entity = selector;

        if (typeof entity !== 'string') {
            entity = entity.join(':');
        }

        const parts = entity.split(':');

        if (!entity.includes(':') || parts?.length !== 2) {
            throw new TypeError(
                `Invalid Stream Selector provided: ${selector}, must contain only two parts, separated by a colon - feedType:feedId | channelType:channelId`
            );
        }

        super(...parts);
    }

    toString() {
        return this.join(':');
    }

    get type() {
        return this[0];
    }

    get id() {
        return this[1];
    }

    get together() {
        return this.join('');
    }

    get uri() {
        return this.join('/');
    }
}
