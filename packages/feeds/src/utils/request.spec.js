import jwt from 'jsonwebtoken';
import request from './request';

jest.mock('phin', () => ({
    __esModule: true,
    default: options =>
        new Promise(res => {
            res(options);
        }),
}));

const defaultBaseURL = `api.stream-io-api.com/api/v1.0/`;

const credentials = {
    api_key: 'STREAM_KEY',
    api_secret: 'STREAM_SECRET',
    app_id: 'STREAM_ID',
};

describe('request utility', () => {
    test('If no region is provided, the request URL should be the default Stream Base URL', () => {
        const url = 'user/1';

        request({
            credentials,
            method: 'GET',
            url,
        }).then(data => {
            expect(data.method).toBe('GET');
            expect(data.parse).toBe('json');
            expect(data.timeout).toBe(5000);
            expect(data.url).toBe(`https://${defaultBaseURL}${url}?api_key=${credentials.api_key}`);
        });
    });

    test('Should use the region in the request URL if provided', () => {
        const region = 'us-east';
        const url = 'user';
        const body = {
            id: 1,
            data: {
                name: 'Test User',
            },
        };

        request({
            credentials: {
                ...credentials,
                region,
            },
            method: 'POST',
            url,
            params: {
                get_or_create: true,
            },
            data: body,
        }).then(data => {
            expect(data.method).toBe('POST');
            expect(data.parse).toBe('json');
            expect(data.timeout).toBe(5000);
            expect(data.url).toBe(`https://${region}-${defaultBaseURL}${url}?api_key=${credentials.api_key}&get_or_create=true`);
        });
    });

    test('Should correctly encode JSON params into the URL', () => {
        const url = 'feed/user/123/follows';
        const params = {
            filter: ['1', '2', '3', '4'],
            limit: 10,
            offset: 5,
            flag: true,
        };

        request({
            credentials,
            method: 'GET',
            url,
            params,
        }).then(data => {
            expect(data.method).toBe('GET');
            expect(data.parse).toBe('json');
            expect(data.timeout).toBe(5000);
            expect(data.url).toBe(`https://${defaultBaseURL}${url}?api_key=${credentials.api_key}&filter=1,2,3,4&limit=10&offset=5&flag=true`);
        });
    });

    test('Should correctly include headers with server-side auth credentials', () => {
        const expectedToken = jwt.sign(
            {
                resource: '*',
                action: '*',
                feed_id: '*',
            },
            credentials.api_secret
        );
        const url = 'user/1';

        request({
            credentials,
            method: 'GET',
            url,
        }).then(data => {
            expect(data.headers['Authorization']).toBe(`Bearer ${expectedToken}`);
            expect(data.headers['Stream-Auth-Type']).toBe(`jwt`);
            expect(data.headers['Content-Type']).toBe(`application/json`);
        });
    });

    test('Should default to a GET request if no method is provided', () => {
        const url = 'user/1';

        request({
            credentials,
            url,
        }).then(data => {
            expect(data.method).toBe(`GET`);
        });
    });
});
