import { gql } from 'apollo-server-express';
import { mergeSchemas } from '@graphql-tools/merge';
import { schema } from '@graphql-stream/feeds';

/**
 * Technically we could define this extension in the schema/index.js file.
 * Usually you might have user data stored in mongo, in which case it would make more sense
 * to define these extensions in the app-level schema so we can merge together data from all sources.
 * * Because we are relying on stream for our user data store, defining the extensions here helps to separate concerns as we don't need any additional third-party data.
 */

const typeDefs = gql`
    extend type StreamUser {
        email: String!
        name: String!
    }
`;

export default mergeSchemas({
    schemas: [schema],
    typeDefs,
});
