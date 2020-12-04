import p from 'phin';

export const request = p.defaults({
    parse: 'json',
    timeout: 10 * 1000,
});
