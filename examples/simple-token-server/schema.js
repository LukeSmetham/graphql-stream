import { composeActivityFeed } from '@stream-io/graphql-feeds';
import { schemaComposer } from 'graphql-compose';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

const credentials = {
    api_key: STREAM_KEY,
    api_secret: STREAM_SECRET,
    app_id: STREAM_ID,
    region: 'us-east',
};

const config = {
    schemaComposer,
    credentials,
};

const { StreamUserTC } = composeActivityFeed(config);

schemaComposer.Query.addFields({
    getStreamToken: StreamUserTC.getResolver('getToken'),
});

const schema = schemaComposer.buildSchema();

export default schema;
