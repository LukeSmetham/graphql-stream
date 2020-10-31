export class EntitySelector extends Array {
    constructor(selector) {
        const parts = selector.split(':');

        if (!selector.includes(':') || parts?.length !== 2) {
            throw new TypeError(
                `Invalid Stream Selector provided: ${selector}, must contain only two parts, separated by a colon - feedType:feedId | channelType:channelId`
            );
        }

        super(...parts);
    }

    get type() {
        return this[0];
    }

    get id() {
        return this[1];
    }

    get together() {
        return this.join(':');
    }
}