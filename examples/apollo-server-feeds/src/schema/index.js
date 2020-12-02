import { gql } from 'apollo-server-express';
import { stitchSchemas } from '@graphql-tools/stitch';
import { delegateToSchema } from '@graphql-tools/delegate';

/** Schemas */
import streamFeeds from './feeds';

/** Gateway Schema */
const resolvers = {
    Query: {
        project: (_, args, context, info) =>
            delegateToSchema({
                args: { id: `feed:${args.name}_${context.streamUserId}` },
                context,
                fieldName: 'feed',
                info,
                operation: 'query',
                schema: streamFeeds,
            }),
    },
};

const typeDefs = gql`
    type Query {
        project(name: String!): Feed!
    }
`;

/**
 * Here we stitch in our extended feeds schema to give our gateway access to it.
 * We can then define typeDefs and resolvers on the gateway schema that can access and delegate to any/all of our additional schemas.
 */
export default stitchSchemas({
    resolvers,
    subschemas: [{ schema: streamFeeds }],
    typeDefs,
});
