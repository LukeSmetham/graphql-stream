export const validateFeedType = type => {
    if (type !== 'flat' && type !== 'aggregated' && type !== 'notification') {
        throw new Error('Unrecognized Feed Type • Choose either `flat` `aggregated` or `notification`');
    }

    return type;
};