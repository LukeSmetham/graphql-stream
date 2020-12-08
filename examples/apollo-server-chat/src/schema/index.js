// import { gql } from 'apollo-server-express';
import { stitchSchemas } from '@graphql-tools/stitch';
// import { delegateToSchema } from '@graphql-tools/delegate';

/** Schemas */
import streamChat from './chat';

/** Gateway Schema */
/*
 * const resolvers = {
 *     Query: {
 *         project: (_, args, context, info) =>
 *             delegateToSchema({
 *                 args: { id: `feed:${args.name}_${context.streamUserId}` },
 *                 context,
 *                 fieldName: 'feed',
 *                 info,
 *                 operation: 'query',
 *                 schema: streamFeeds,
 *             }),
 *     },
 * };
 */

/*
 * const typeDefs = gql`
 *     type Query {
 *         project(name: String!): StreamFeed!
 *     }
 * `;
 */

export default stitchSchemas({
    subschemas: [{ schema: streamChat }],
});
