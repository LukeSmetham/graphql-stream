import phin from 'phin';
import jwt from 'jsonwebtoken';

const tokenPayload = {
    resource: '*',
    action: '*',
    feed_id: '*',
};

const parseCredentials = credentials => {
    const baseUrl = credentials.region
        ? `https://${credentials.region}-api.stream-io-api.com/api/v1.0`
        : 'https://api.stream-io-api.com/api/v1.0';

    const headers = {
        Authorization: `Bearer ${jwt.sign(tokenPayload, credentials.api_secret)}`,
        'Stream-Auth-Type': 'jwt',
        'Content-Type': 'application/json',
    };

    return {
        baseUrl,
        headers,
    };
};

const request = ({ credentials, data, method = 'GET', params = {}, url }) => {
    const { baseUrl, headers } = parseCredentials(credentials, params);

    const paramString = Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${params[k]}`)
        .join('&');

    return phin({
        data,
        url: `${baseUrl}/${url}?api_key=${credentials.api_key}&${paramString ?? ''}`,
        method,
        headers,
        parse: 'json',
        timeout: 5000,
    });
};

export default request;
