import { DateTimeResolver, JSONResolver, JWTResolver, UUIDResolver } from 'graphql-scalars';
import { StreamIDResolver } from 'scalars';

/**
 * Ensures the schema composer contains the required schemas we need to create Stream types & resolvers.
 * @param {SchemaComposer} schemaComposer
 */
export const ensureScalars = schemaComposer => {
    if (!schemaComposer.has('JSON')) {
        schemaComposer.add(JSONResolver);
    }

    if (!schemaComposer.has('StreamID')) {
        schemaComposer.add(StreamIDResolver);
    }

    if (!schemaComposer.has('UUID')) {
        schemaComposer.add(UUIDResolver);
    }

    if (!schemaComposer.has('DateTime')) {
        schemaComposer.add(DateTimeResolver);
    }

    if (!schemaComposer.has('JWT')) {
        schemaComposer.add(JWTResolver);
    }
};
